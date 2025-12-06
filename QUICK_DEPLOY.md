# 🎯 Quick Netlify Deployment - FlowerLighting

## Your Domain is in Netlify ✅

### Fast Path to Deploy:

#### 1️⃣ **Install Git** (If not already)
- Download: https://git-scm.com/download/win
- Install with default settings
- Restart your terminal/PowerShell

#### 2️⃣ **Create GitHub Repository**
1. Go to https://github.com/new
2. Name: `flowerlighting`
3. Private/Public (your choice)
4. Click **Create repository**
5. Copy the HTTPS URL

#### 3️⃣ **Push Code to GitHub**
Open PowerShell in your project folder:
```powershell
cd c:\Users\games\Desktop\FlowerLighting

# First time setup
git init
git config user.email "your-email@example.com"
git config user.name "Your Name"
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/flowerlighting.git
git branch -M main
git push -u origin main
```

#### 4️⃣ **Connect GitHub to Netlify**
1. Login to https://app.netlify.com
2. **New site from Git** button
3. Choose **GitHub**
4. Authorize & select `flowerlighting` repo
5. Build settings:
   - Command: `npm run build`
   - Publish: `dist`

#### 5️⃣ **Add Environment Variable**
In Netlify dashboard:
1. **Site settings** → **Build & deploy** → **Environment**
2. Click **Edit variables**
3. Add:
   - Key: `DATABASE_URL`
   - Value: `postgresql://neondb_owner:npg_yqBKGUZD6iC2@ep-shiny-bar-aeu8xyyh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`

#### 6️⃣ **Connect Your Domain**
In Netlify:
1. **Domain settings**
2. **Add domain** or **Connect domain**
3. Enter your domain
4. Follow DNS setup (Netlify will guide you)

---

## That's it! 🎉

Your site will:
- ✅ Auto-deploy on every GitHub push
- ✅ Build using your `netlify.toml` config
- ✅ Load environment variables automatically
- ✅ Be available on your domain

## Check Deployment Status
- https://app.netlify.com → Select your site → View deployments

## Files Set Up for Netlify
- ✅ `netlify.toml` - Build configuration
- ✅ `.gitignore` - Protect sensitive files
- ✅ `astro.config.mjs` - Astro settings
- ✅ `NETLIFY_SETUP.md` - Full instructions

---

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Git not found | Install from https://git-scm.com/download/win |
| Push fails | Check GitHub URL and credentials |
| Build fails on Netlify | Check build logs in Netlify dashboard |
| Site shows 404 | Clear cache, verify `dist` folder exists locally |
| Domain not working | Wait 24-48 hours for DNS, check nameservers |

**Questions?** See `NETLIFY_SETUP.md` for full details!
