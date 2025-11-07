# How to View/Run the Club Smart System

## Step-by-Step Instructions

### Step 1: Install Dependencies

First, you need to install all required packages. Open a terminal in the project folder and run:

**Option A - Install all at once (Recommended):**
```bash
npm run install-all
```

**Option B - Install manually:**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 2: Start the Application

After dependencies are installed, start both the backend and frontend:

```bash
npm run dev
```

This will start:
- **Backend Server** on `http://localhost:5000`
- **Frontend React App** on `http://localhost:3000`

### Step 3: View in Browser

Once the servers are running, open your web browser and navigate to:

**Customer App:**
```
http://localhost:3000
```

**Admin Dashboard:**
```
http://localhost:3000/admin
```

## What You'll See

### Customer App Features:
- **Home Page** - Welcome screen with feature highlights
- **Menus** - Browse and order from all cafés and restaurants
- **Orders** - View your order history and track status
- **Padel** - Book padel courts
- **Cart** - Shopping cart icon in bottom-right corner

### Admin Dashboard:
- View all orders
- Update order status
- Delete orders
- Filter by status
- View statistics

## Language Switching

Click the **EN** or **AR** buttons in the navigation bar to switch between English and Arabic.

## Troubleshooting

### Port Already in Use
If port 3000 or 5000 is already in use:
- Close other applications using those ports
- Or change the ports in `package.json`

### Dependencies Not Installing
- Make sure you have Node.js installed (v14 or higher)
- Try: `npm cache clean --force` then install again

### Server Won't Start
- Check that Node.js is installed: `node --version`
- Check that npm is installed: `npm --version`

## Need Help?

See `README.md` for detailed documentation or `QUICKSTART.md` for more information.

