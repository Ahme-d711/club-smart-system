# How to Start the Application - Fix Proxy Errors

## Problem
You're seeing "Proxy error: ECONNREFUSED" which means the **backend server is not running**.

The frontend (React app on port 3000) is running, but it can't connect to the backend API (port 5000).

## Solution: Start Both Servers

### Option 1: Start Both Servers Separately (Easiest)

**Step 1: Start Backend Server**
1. Double-click **`START_SERVER.bat`**
   - Or open Command Prompt and run:
     ```cmd
     cd C:\Users\user1\club-smart-system
     node server/index.js
     ```
2. You should see: **"Server running on port 5000"**
3. **Keep this window open!**

**Step 2: Start Frontend (in a NEW window)**
1. Double-click **`START_CLIENT.bat`**
   - Or open a NEW Command Prompt and run:
     ```cmd
     cd C:\Users\user1\club-smart-system\client
     npm start
     ```
2. Browser should open automatically to `http://localhost:3000`
3. **Keep this window open too!**

### Option 2: Start Both at Once

**Double-click `START_BOTH.bat`**
- This will open two separate windows:
  - Window 1: Backend server (port 5000)
  - Window 2: Frontend React app (port 3000)
- **Keep both windows open!**

### Option 3: Use QUICK_START.bat

**Double-click `QUICK_START.bat`**
- This tries to start both servers together
- If you see errors, use Option 1 instead

## Verification

### Check Backend is Running:
1. Open browser: http://localhost:5000/api/menus
2. Should see JSON data (menu items)
3. If you see data, backend is working ✅

### Check Frontend:
1. Open browser: http://localhost:3000
2. Should see the Club Smart System homepage
3. If you see the page, frontend is working ✅

### Check No Proxy Errors:
1. Open browser console (F12)
2. Should NOT see "ECONNREFUSED" errors
3. API calls should work ✅

## Important Notes

### ⚠️ Keep Both Servers Running!
- **Backend server** must stay running (port 5000)
- **Frontend server** must stay running (port 3000)
- Close the windows to stop the servers

### ⚠️ Start Backend First!
- Always start backend server before frontend
- Backend needs to be ready when frontend starts

### ⚠️ Don't Close the Windows!
- Closing the command windows will stop the servers
- Keep both windows open while using the app

## Troubleshooting

### Backend Won't Start

**Error: "Cannot find module"**
```cmd
cd C:\Users\user1\club-smart-system
"C:\Program Files\nodejs\npm.cmd" install
```

**Error: "Port 5000 already in use"**
- Another application is using port 5000
- Close other applications or change port in `.env` file

**Error: "nodemon not found"**
- Use `node server/index.js` instead
- nodemon is optional (only for auto-restart)

### Frontend Won't Start

**Error: "Cannot find module"**
```cmd
cd C:\Users\user1\club-smart-system\client
"C:\Program Files\nodejs\npm.cmd" install
```

**Error: "Port 3000 already in use"**
- Another application is using port 3000
- Close other applications

## Quick Reference

| Task | Command | File |
|------|---------|------|
| Start Backend | `node server/index.js` | START_SERVER.bat |
| Start Frontend | `cd client && npm start` | START_CLIENT.bat |
| Start Both | `npm run dev` | START_BOTH.bat |
| Install Dependencies | `npm install` | INSTALL_DEPENDENCIES.bat |

## Step-by-Step Quick Start

1. **Double-click `START_SERVER.bat`**
   - Wait for "Server running on port 5000"

2. **Double-click `START_CLIENT.bat`** (in new window)
   - Wait for browser to open

3. **Test the application:**
   - Backend: http://localhost:5000/api/menus
   - Frontend: http://localhost:3000

4. **Done!** Both servers are running ✅

