const express = require('express');
const router = express.Router();
const multer = require('multer');
let XLSX;
try {
  XLSX = require('xlsx');
} catch (error) {
  console.error('XLSX library not installed. Please run: npm install xlsx');
  XLSX = null;
}
const fs = require('fs').promises;
const path = require('path');

const MENUS_FILE = path.join(__dirname, '../data/menus.json');
const UPLOAD_DIR = path.join(__dirname, '../uploads');

// Ensure upload directory exists
(async () => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
})();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `menu-${Date.now()}.xlsx`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.originalname.endsWith('.xlsx') ||
        file.originalname.endsWith('.xls')) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Helper function to read menus
async function readMenus() {
  try {
    const data = await fs.readFile(MENUS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write menus
async function writeMenus(menus) {
  await fs.writeFile(MENUS_FILE, JSON.stringify(menus, null, 2));
}

// Parse Excel file and convert to menu format
function parseExcelToMenus(filePath) {
  if (!XLSX) {
    throw new Error('XLSX library not installed');
  }
  
  const workbook = XLSX.readFile(filePath);
  const menus = [];
  
  // Process each sheet (each sheet = one venue)
  workbook.SheetNames.forEach((sheetName, index) => {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) return;
    
    // Expected format:
    // Column headers: Name (EN), Name (AR), Description (EN), Description (AR), Price, Category, Image URL
    // Or: Name, Description, Price, Category (if single language)
    
    const items = [];
    const venueId = `venue-${index + 1}`;
    const venueName = sheetName; // Use sheet name as venue name
    
    // Detect if bilingual or single language
    const hasArabic = data.some(row => row['Name (AR)'] || row['Name (Arabic)'] || row['الاسم']);
    
    data.forEach((row, rowIndex) => {
      // Skip empty rows
      if (!row['Name'] && !row['Name (EN)'] && !row['Item Name']) return;
      
      const item = {
        id: `${venueId}-${rowIndex + 1}`,
        name: hasArabic ? {
          en: row['Name (EN)'] || row['Name'] || row['Item Name'] || '',
          ar: row['Name (AR)'] || row['Name (Arabic)'] || row['الاسم'] || row['Name (EN)'] || row['Name'] || ''
        } : (row['Name'] || row['Item Name'] || ''),
        description: hasArabic ? {
          en: row['Description (EN)'] || row['Description'] || row['Item Description'] || '',
          ar: row['Description (AR)'] || row['Description (Arabic)'] || row['الوصف'] || row['Description (EN)'] || row['Description'] || ''
        } : (row['Description'] || row['Item Description'] || ''),
        price: parseFloat(row['Price'] || row['Item Price'] || 0) || 0,
        category: row['Category'] || row['Item Category'] || 'other',
        image: row['Image URL'] || row['Image'] || row['Image URL'] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
      };
      
      if (item.name && item.price > 0) {
        items.push(item);
      }
    });
    
    if (items.length > 0) {
      menus.push({
        id: venueId,
        name: {
          en: venueName,
          ar: venueName
        },
        type: venueName.toLowerCase().includes('cafe') ? 'cafe' : 'restaurant',
        items: items
      });
    }
  });
  
  return menus;
}

// Upload and import Excel file
router.post('/menus', upload.single('file'), async (req, res) => {
  try {
    if (!XLSX) {
      return res.status(500).json({ error: 'XLSX library not installed. Please run: npm install xlsx' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const filePath = req.file.path;
    
    try {
      // Parse Excel file
      const newMenus = parseExcelToMenus(filePath);
      
      if (newMenus.length === 0) {
        // Clean up uploaded file
        await fs.unlink(filePath);
        return res.status(400).json({ error: 'No valid menu data found in Excel file' });
      }
      
      // Read existing menus
      const existingMenus = await readMenus();
      
      // Merge or replace menus
      // Option 1: Replace all menus
      // await writeMenus(newMenus);
      
      // Option 2: Merge (update existing, add new)
      const mergedMenus = [...existingMenus];
      
      newMenus.forEach(newMenu => {
        const existingIndex = mergedMenus.findIndex(m => m.id === newMenu.id);
        if (existingIndex >= 0) {
          // Update existing menu
          mergedMenus[existingIndex] = newMenu;
        } else {
          // Add new menu
          mergedMenus.push(newMenu);
        }
      });
      
      await writeMenus(mergedMenus);
      
      // Clean up uploaded file
      await fs.unlink(filePath);
      
      res.json({
        success: true,
        message: `Successfully imported ${newMenus.length} venue(s) with ${newMenus.reduce((sum, m) => sum + m.items.length, 0)} items`,
        menus: newMenus
      });
    } catch (error) {
      // Clean up uploaded file on error
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        // Ignore cleanup errors
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Error importing menus:', error);
    res.status(500).json({ error: error.message || 'Error importing menus from Excel file' });
  }
});

// Get import template
router.get('/template', (req, res) => {
  try {
    if (!XLSX) {
      return res.status(500).json({ error: 'XLSX library not installed. Please run: npm install xlsx' });
    }
    
    // Create a sample Excel template
    const templateData = [
      {
        'Name (EN)': 'Espresso',
        'Name (AR)': 'إسبريسو',
        'Description (EN)': 'Strong Italian coffee',
        'Description (AR)': 'قهوة إيطالية قوية',
        'Price': 15,
        'Category': 'coffee',
        'Image URL': 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400'
      },
      {
        'Name (EN)': 'Cappuccino',
        'Name (AR)': 'كابتشينو',
        'Description (EN)': 'Espresso with steamed milk foam',
        'Description (AR)': 'إسبريسو مع رغوة الحليب المطهو بالبخار',
        'Price': 20,
        'Category': 'coffee',
        'Image URL': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400'
      }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Main Café');
    
    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=menu-template.xlsx');
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error generating template:', error);
    res.status(500).json({ error: 'Error generating template: ' + error.message });
  }
});

module.exports = router;

