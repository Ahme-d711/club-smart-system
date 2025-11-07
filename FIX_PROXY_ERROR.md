# Fix: Proxy Error (ECONNREFUSED)

## Problem
The frontend (React app) is running but can't connect to the backend server. The error "ECONNREFUSED" means the backend server on port 5000 is not running.

## Solution

### Option 1: Start Backend Server Separately (Recommended)

**Step 1: Start Backend Server**
- Double-click `START_SERVER.bat`
- Or in Command Prompt:
  ```cmd
  cd C:\Users\user1\club-smart-system
  node server/index.js
  ```
- You should see: "Server running on port 5000"

**Step 2: Start Frontend (in another window)**
- Double-click `START_CLIENT.bat`
- Or in Command Prompt:
  ```cmd
  cd C:\Users\user1\club-smart-system\client
  npm start
  ```

### Option 2: Start Both at Once

**Double-click `START_BOTH.bat`**
- This will open two separate windows:
  - One for backend (port 5000)
  - One for frontend (port 3000)
- Keep both windows open!

### Option 3: Use QUICK_START.bat (if concurrently works)

**Double-click `QUICK_START.bat`**
- This tries to start both servers together
- If it doesn't work, use Option 1 or 2 instead

## Verification

1. **Check Backend Server:**
   - Open: http://localhost:5000/api/menus
   - Should return JSON data (menu items)

2. **Check Frontend:**
   - Open: http://localhost:3000
   - Should show the application

3. **No More Proxy Errors:**
   - Once backend is running, proxy errors should stop
   - Frontend can now communicate with backend

## Common Issues

### Issue: "Cannot find module"
- Solution: Make sure you ran `npm install` in the root folder

### Issue: "Port 5000 already in use"
- Solution: Another process is using port 5000
- Close other applications or change port in `.env` file

### Issue: "nodemon not found"
- Solution: Backend can run without nodemon
- Use `node server/index.js` instead

## Quick Fix Steps

1. **Stop everything** (if running):
   - Close all terminal/command windows
   - Press Ctrl+C if servers are running

2. **Start Backend First:**
   ```cmd
   cd C:\Users\user1\club-smart-system
   node server/index.js
   ```
   - Wait for "Server running on port 5000"

3. **Start Frontend (new window):**
   ```cmd
   cd C:\Users\user1\club-smart-system\client
   npm start
   ```

4. **Test:**
   - Backend: http://localhost:5000/api/menus
   - Frontend: http://localhost:3000

## Why This Happens

The `npm run dev` command uses `concurrently` to start both servers. If:
- `concurrently` is not installed properly
- There's an error starting the backend
- The backend crashes immediately

Then the frontend starts but can't connect to the backend.

## Solution: Start Servers Separately

Starting servers separately is more reliable:
- You can see backend errors clearly
- You can restart backend without affecting frontend
- Easier to debug issues

