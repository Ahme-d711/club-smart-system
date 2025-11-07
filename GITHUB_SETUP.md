# How to Upload Project to GitHub

## Step 1: Create a GitHub Repository

1. **Go to GitHub:**
   - Visit https://github.com
   - Sign in (or create an account if you don't have one)

2. **Create New Repository:**
   - Click the "+" icon in the top right
   - Select "New repository"

3. **Repository Settings:**
   - **Repository name:** `club-smart-system` (or any name you prefer)
   - **Description:** "Smart software system for club hospitality and recreation management"
   - **Visibility:** Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

4. **Copy the repository URL:**
   - GitHub will show you the repository URL
   - It will look like: `https://github.com/yourusername/club-smart-system.git`
   - Copy this URL - you'll need it in the next step

## Step 2: Initialize Git in Your Project

Open Command Prompt in your project folder and run:

```cmd
cd C:\Users\user1\club-smart-system
git init
```

## Step 3: Add Files to Git

```cmd
git add .
```

This adds all files (respecting .gitignore rules).

## Step 4: Create Initial Commit

```cmd
git commit -m "Initial commit: Club Smart System"
```

## Step 5: Connect to GitHub

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```cmd
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

For example:
```cmd
git remote add origin https://github.com/johndoe/club-smart-system.git
```

## Step 6: Push to GitHub

```cmd
git branch -M main
git push -u origin main
```

You'll be prompted for your GitHub username and password (or personal access token).

## Alternative: Using GitHub Desktop

### Option A: GitHub Desktop (Easier)

1. **Download GitHub Desktop:**
   - Visit: https://desktop.github.com
   - Download and install GitHub Desktop

2. **Sign in to GitHub:**
   - Open GitHub Desktop
   - Sign in with your GitHub account

3. **Add Repository:**
   - Click "File" → "Add Local Repository"
   - Browse to: `C:\Users\user1\club-smart-system`
   - Click "Add"

4. **Publish Repository:**
   - Click "Publish repository" button
   - Enter repository name
   - Choose Public or Private
   - Click "Publish Repository"

## Quick Command Summary

```cmd
cd C:\Users\user1\club-smart-system
git init
git add .
git commit -m "Initial commit: Club Smart System"
git remote add origin https://github.com/YOUR_USERNAME/club-smart-system.git
git branch -M main
git push -u origin main
```

## What Gets Uploaded

✅ **Included:**
- All source code (server/, client/)
- Configuration files (package.json, etc.)
- Documentation (README.md, etc.)
- Public data files (menus.json, tables.json templates)

❌ **Excluded (by .gitignore):**
- `node_modules/` - Dependencies (will be installed by others)
- `client/build/` - Build files (generated)
- `.env` - Environment variables (sensitive)
- `server/data/orders.json` - User data
- `server/data/padel.json` - User data
- `server/uploads/` - Uploaded files

## Authentication

### If Using Personal Access Token (Recommended)

1. **Create Token:**
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token
   - Select scopes: `repo` (full control)
   - Copy the token

2. **Use Token:**
   - When prompted for password, use the token instead

### If Using GitHub CLI

```cmd
gh auth login
gh repo create club-smart-system --public --source=. --remote=origin --push
```

## Verification

After pushing, visit your GitHub repository:
- You should see all your files
- README.md should be visible
- All source code should be there

## Updating the Repository

After making changes:

```cmd
git add .
git commit -m "Description of changes"
git push
```

## Important Notes

⚠️ **Security:**
- Never commit `.env` files with sensitive data
- Never commit passwords or API keys
- The `.gitignore` file is set up to exclude sensitive files

⚠️ **Large Files:**
- If you have large files, consider using Git LFS
- Or exclude them from the repository

⚠️ **Dependencies:**
- Others will need to run `npm install` after cloning
- Document this in README.md

## Troubleshooting

### "Authentication failed"
- Use Personal Access Token instead of password
- Or use GitHub Desktop

### "Repository not found"
- Check repository name and URL
- Make sure repository exists on GitHub

### "Permission denied"
- Check you have access to the repository
- Verify your GitHub credentials

### "Large files error"
- Remove large files from commit
- Use Git LFS for large files
- Or exclude from repository

## Next Steps After Upload

1. **Add README.md** (already exists)
2. **Add LICENSE** (if needed)
3. **Set up GitHub Actions** (optional, for CI/CD)
4. **Add collaborators** (if working with a team)
5. **Create releases** (for version management)

