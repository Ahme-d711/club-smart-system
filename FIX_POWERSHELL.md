# Fix PowerShell Execution Policy Issue

## Problem
PowerShell is blocking npm from running due to execution policy restrictions.

## Solution Options

### Option 1: Change Execution Policy (Recommended - Permanent Fix)

1. **Open PowerShell as Administrator:**
   - Press `Windows + X`
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"
   - Click "Yes" when prompted by User Account Control

2. **Run this command:**
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   
3. **Type `Y` and press Enter when prompted**

4. **Verify it worked:**
   ```powershell
   Get-ExecutionPolicy
   ```
   Should show: `RemoteSigned`

5. **Close and reopen your terminal**, then try npm again

### Option 2: Bypass for Current Session (Temporary)

If you don't want to change the policy permanently, run this in your current PowerShell window:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

This only affects the current PowerShell session.

### Option 3: Use Command Prompt Instead

You can use Command Prompt (cmd.exe) instead of PowerShell:

1. Press `Windows + R`
2. Type `cmd` and press Enter
3. Navigate to your project:
   ```cmd
   cd C:\Users\user1\club-smart-system
   ```
4. Run npm commands as normal

### Option 4: Use npm.cmd directly

Instead of `npm`, use `npm.cmd`:

```powershell
npm.cmd --version
npm.cmd install
```

## After Fixing

Once the execution policy is fixed, you can proceed with:

```powershell
cd C:\Users\user1\club-smart-system
npm run install-all
npm run dev
```

