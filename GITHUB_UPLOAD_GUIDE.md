# How to Upload Project to GitHub

## Step 1: Install Git (Required)

### Download Git:
1. Visit: https://git-scm.com/download/win
2. Download the Windows installer
3. Run the installer
4. **Important:** During installation, check "Add Git to PATH"
5. Complete the installation

### Verify Installation:
Open Command Prompt and run:
```cmd
git --version
```
Should show: `git version 2.x.x`

## Step 2: Create GitHub Account (If Needed)

1. Visit: https://github.com
2. Sign up for a free account (if you don't have one)
3. Verify your email address

## Step 3: Create Repository on GitHub

1. **Go to GitHub:**
   - Visit https://github.com
   - Sign in to your account

2. **Create New Repository:**
   - Click the "+" icon (top right)
   - Select "New repository"

3. **Repository Settings:**
   - **Repository name:** `club-smart-system` (or any name)
   - **Description:** "Smart software system for club hospitality and recreation management"
   - **Visibility:** Choose Public or Private
   - **IMPORTANT:** Do NOT check "Initialize this repository with a README"
   - Do NOT add .gitignore or license (we already have these)
   - Click "Create repository"

4. **Copy Repository URL:**
   - GitHub will show you the repository URL
   - Example: `https://github.com/yourusername/club-smart-system.git`
   - **Copy this URL** - you'll need it!

## Step 4: Initialize Git in Your Project

Open **Command Prompt** (not PowerShell) and run:

```cmd
cd C:\Users\user1\club-smart-system
git init
```

## Step 5: Add Files to Git

```cmd
git add .
```

This adds all files (respecting .gitignore rules).

## Step 6: Create Initial Commit

```cmd
git commit -m "Initial commit: Club Smart System"
```

## Step 7: Connect to GitHub

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```cmd
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Example:**
```cmd
git remote add origin https://github.com/johndoe/club-smart-system.git
```

## Step 8: Push to GitHub

```cmd
git branch -M main
git push -u origin main
```

### Authentication

You'll be prompted for credentials:

**Option 1: Personal Access Token (Recommended)**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Select scope: `repo` (full control)
4. Copy the token
5. When prompted:
   - Username: Your GitHub username
   - Password: Paste the token (not your password)

**Option 2: GitHub Desktop**
- Download GitHub Desktop: https://desktop.github.com
- Sign in with GitHub
- Use the GUI to push

## Complete Command Sequence

```cmd
cd C:\Users\user1\club-smart-system
git init
git add .
git commit -m "Initial commit: Club Smart System"
git remote add origin https://github.com/YOUR_USERNAME/club-smart-system.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Alternative: Using GitHub Desktop (Easier)

### Step 1: Download GitHub Desktop
- Visit: https://desktop.github.com
- Download and install GitHub Desktop

### Step 2: Sign In
- Open GitHub Desktop
- Sign in with your GitHub account

### Step 3: Add Repository
- Click "File" → "Add Local Repository"
- Browse to: `C:\Users\user1\club-smart-system`
- Click "Add"

### Step 4: Publish Repository
- Click "Publish repository" button
- Enter repository name: `club-smart-system`
- Choose Public or Private
- Click "Publish Repository"

**Done!** Your code is now on GitHub.

## What Gets Uploaded

### ✅ Included:
- All source code (server/, client/)
- Configuration files (package.json, etc.)
- Documentation (README.md, guides)
- Template data files (menus.json, tables.json)

### ❌ Excluded (by .gitignore):
- `node_modules/` - Dependencies (others will install)
- `client/build/` - Build files (generated)
- `.env` - Environment variables (sensitive)
- `server/data/orders.json` - User data
- `server/data/padel.json` - User data
- `server/uploads/` - Uploaded files

## Verification

After pushing, visit your GitHub repository:
- You should see all your files
- README.md should be visible
- All source code should be there
- Repository should be accessible

## Updating the Repository

After making changes to your code:

```cmd
cd C:\Users\user1\club-smart-system
git add .
git commit -m "Description of your changes"
git push
```

## Troubleshooting

### "Git is not recognized"
- **Solution:** Install Git from https://git-scm.com/download/win
- Make sure to check "Add Git to PATH" during installation
- Restart Command Prompt after installation

### "Authentication failed"
- **Solution:** Use Personal Access Token instead of password
- GitHub no longer accepts passwords for Git operations
- Create token: Settings → Developer settings → Personal access tokens

### "Repository not found"
- **Solution:** Check repository name and URL
- Make sure repository exists on GitHub
- Verify you have access to the repository

### "Permission denied"
- **Solution:** Check you have write access to the repository
- Verify your GitHub credentials
- Use Personal Access Token with `repo` scope

### "Large files error"
- **Solution:** Remove large files from commit
- Or use Git LFS for large files
- Check .gitignore excludes large files

## Security Notes

⚠️ **Important:**
- Never commit `.env` files with sensitive data
- Never commit passwords or API keys
- The `.gitignore` file is set up to exclude sensitive files
- Review what you're committing before pushing

## Quick Reference

| Task | Command |
|------|---------|
| Initialize Git | `git init` |
| Add files | `git add .` |
| Commit | `git commit -m "Message"` |
| Connect to GitHub | `git remote add origin URL` |
| Push to GitHub | `git push -u origin main` |
| Update repository | `git add . && git commit -m "Update" && git push` |

## Next Steps After Upload

1. ✅ Add README.md (already exists)
2. ✅ Add LICENSE (optional)
3. ✅ Set up GitHub Actions (optional, for CI/CD)
4. ✅ Add collaborators (if working with a team)
5. ✅ Create releases (for version management)

