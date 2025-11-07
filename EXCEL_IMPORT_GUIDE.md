# Excel Menu Import Guide

## Overview

You can automatically import menus from Excel files (.xlsx or .xls) into the system. This makes it easy to bulk-add or update menu items.

## How to Import

### Step 1: Access Import Page
1. Login as admin
2. Navigate to "Import Menus" in the navigation bar
3. Or go directly to: `http://localhost:3000/admin/import`

### Step 2: Prepare Your Excel File

Your Excel file should follow one of these formats:

#### Format 1: Bilingual (Recommended)
| Name (EN) | Name (AR) | Description (EN) | Description (AR) | Price | Category | Image URL |
|-----------|-----------|------------------|------------------|-------|----------|-----------|
| Espresso | إسبريسو | Strong Italian coffee | قهوة إيطالية قوية | 15 | coffee | https://... |
| Cappuccino | كابتشينو | Espresso with milk | إسبريسو مع الحليب | 20 | coffee | https://... |

#### Format 2: Single Language
| Name | Description | Price | Category | Image URL |
|------|-------------|-------|----------|-----------|
| Espresso | Strong Italian coffee | 15 | coffee | https://... |
| Cappuccino | Espresso with milk | 20 | coffee | https://... |

### Step 3: Organize by Venues

- **Each sheet in your Excel file = One venue (café or restaurant)**
- The sheet name will be used as the venue name
- Example:
  - Sheet 1: "Main Café" → Creates venue "Main Café"
  - Sheet 2: "Fine Dining Restaurant" → Creates venue "Fine Dining Restaurant"

### Step 4: Upload and Import

1. Click "Select Excel File" button
2. Choose your Excel file (.xlsx or .xls)
3. Click "Import Menus"
4. Wait for the import to complete
5. You'll see a success message with details

## Column Requirements

### Required Columns:
- **Name (EN)** or **Name** - Item name (required)
- **Price** - Item price in numbers (required)
- **Category** - Item category (e.g., coffee, main, dessert, etc.)

### Optional Columns:
- **Name (AR)** - Arabic name (if not provided, English name will be used)
- **Description (EN)** or **Description** - Item description
- **Description (AR)** - Arabic description
- **Image URL** - Image URL for the item (default image will be used if not provided)

## Excel Format Rules

1. **First row** should contain column headers
2. **Each subsequent row** represents one menu item
3. **Empty rows** will be skipped
4. **Items without names or prices** will be skipped
5. **Sheet names** become venue names

## Example Excel Structure

```
Sheet 1: "Main Café"
┌──────────────┬──────────────┬──────────────────────┬──────────┬──────────┐
│ Name (EN)    │ Name (AR)    │ Description (EN)     │ Price   │ Category │
├──────────────┼──────────────┼──────────────────────┼──────────┼──────────┤
│ Espresso     │ إسبريسو     │ Strong coffee        │ 15      │ coffee   │
│ Cappuccino   │ كابتشينو    │ Coffee with milk     │ 20      │ coffee   │
└──────────────┴──────────────┴──────────────────────┴──────────┴──────────┘

Sheet 2: "Fine Dining Restaurant"
┌──────────────┬──────────────┬──────────────────────┬──────────┬──────────┐
│ Name (EN)    │ Name (AR)    │ Description (EN)     │ Price   │ Category │
├──────────────┼──────────────┼──────────────────────┼──────────┼──────────┤
│ Grilled Salmon│ سلمون مشوي │ Fresh salmon         │ 85      │ main     │
│ Beef Steak   │ ستيك لحم     │ Premium beef         │ 120     │ main     │
└──────────────┴──────────────┴──────────────────────┴──────────┴──────────┘
```

## Download Template

Click the "Download Template" button on the import page to get a sample Excel file with the correct format. You can use this as a starting point.

## Import Behavior

- **New venues**: Will be added to the system
- **Existing venues**: Will be updated with new items
- **Duplicate items**: Will be replaced (based on ID)
- **Items are merged**: Existing items are preserved, new ones are added

## Troubleshooting

### Common Issues:

1. **"No valid menu data found"**
   - Check that your file has data in the expected columns
   - Ensure at least one row has Name and Price filled

2. **"Only Excel files are allowed"**
   - Make sure you're uploading a .xlsx or .xls file
   - Not a CSV or other format

3. **"File too large"**
   - Maximum file size is 10MB
   - Consider splitting into multiple files

4. **Items not showing up**
   - Check that items have valid names and prices
   - Verify column headers match expected format
   - Check that price is a valid number

## Tips

1. **Use the template**: Download the template first to see the exact format
2. **Test with small file**: Import a few items first to verify format
3. **Check sheet names**: Make sure sheet names are descriptive (they become venue names)
4. **Verify prices**: Ensure prices are numbers, not text
5. **Image URLs**: Use valid image URLs or leave blank for default images

## File Size Limits

- Maximum file size: 10MB
- Recommended: Keep files under 5MB for faster processing

## Support

If you encounter issues:
1. Check the error message for specific details
2. Verify your Excel format matches the template
3. Try downloading and using the template as a base

