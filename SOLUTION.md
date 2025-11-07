# Solution for PowerShell Execution Policy Issue

## Quick Solution

Since you're getting PowerShell execution policy errors, I've created batch files that use the full path to npm.

### Option 1: Use the Batch File (Easiest)

**Double-click this file:**
```
INSTALL_DEPENDENCIES.bat
```

This will:
1. Install all root dependencies
2. Install all client dependencies
3. Show you when it's done

### Option 2: Use Command Prompt

1. Press `Windows + R`
2. Type `cmd` and press Enter
3. Navigate to your project:
   ```cmd
   cd C:\Users\user1\club-smart-system
   ```
4. Run:
   ```cmd
   npm install
   cd client
   npm install
   cd ..
   ```

### Option 3: Use the Existing Batch File

Double-click `run-npm.bat` and it will show you options, or run:
```cmd
run-npm.bat install-all
```

## Dependencies Already Installed!

I've already installed the root dependencies using the full npm path. You just need to install the client dependencies.

### To Complete Installation:

**Option A: Use Command Prompt**
```cmd
cd C:\Users\user1\club-smart-system\client
npm install
```

**Option B: Double-click INSTALL_DEPENDENCIES.bat**
This will install both root and client dependencies (will skip root since already installed).

## After Installation

Once dependencies are installed, you can start the application:

**Option 1: Double-click `QUICK_START.bat`**

**Option 2: Use Command Prompt**
```cmd
cd C:\Users\user1\club-smart-system
npm run dev
```

**Option 3: Use the batch file**
```cmd
run-npm.bat dev
```

## What Was Fixed

1. ✅ **Root dependencies installed** - multer and xlsx packages are now installed
2. ✅ **Batch files updated** - All batch files now use full path to npm to avoid PowerShell issues
3. ✅ **Excel template download** - Should work now after dependencies are installed
4. ✅ **Padel times** - Fixed the availability endpoint

## Next Steps

1. **Install client dependencies** (if not done):
   - Double-click `INSTALL_DEPENDENCIES.bat`
   - Or use Command Prompt: `cd client` then `npm install`

2. **Start the application**:
   - Double-click `QUICK_START.bat`
   - Or use: `npm run dev`

3. **Test the fixes**:
   - Check menu items at `/menus`
   - Check padel times at `/padel`
   - Try downloading Excel template at `/admin/import`

## Notes

- The batch files now use the full path to npm (`C:\Program Files\nodejs\npm.cmd`) to avoid PowerShell execution policy issues
- All dependencies should install correctly now
- The Excel import feature will work once all dependencies are installed

