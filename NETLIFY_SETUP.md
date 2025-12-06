# 🚀 Netlify Deployment Guide - FlowerLighting

## ✅ Prerequisites
- ✓ GitHub account (code repository)
- ✓ Netlify account with your domain
- ✓ Project built and ready (`dist/` folder exists)

## 📋 Step-by-Step Deployment

### Step 1: Initialize Git Repository
```powershell
cd c:\Users\games\Desktop\FlowerLighting
git init
git add .
git commit -m "Initial FlowerLighting deployment setup"
```

### Step 2: Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `flowerlighting`
3. Do NOT initialize with README (we have one)
4. Copy the repository URL

### Step 3: Push to GitHub
```powershell
cd c:\Users\games\Desktop\FlowerLighting
git remote add origin https://github.com/YOUR_USERNAME/flowerlighting.git
git branch -M main
git push -u origin main
```

### Step 4: Connect to Netlify
1. Go to [app.netlify.com](https://app.netlify.com)
2. Sign in with your account
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **GitHub** as your Git provider
5. Authorize Netlify to access your GitHub repositories
6. Select **`flowerlighting`** repository
7. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** `20`

### Step 5: Add Environment Variables
1. Go to your Netlify site dashboard
2. **Settings** → **Build & deploy** → **Environment**
3. Add this variable:
   - **Key:** `DATABASE_URL`
   - **Value:** (paste from your `.env` file)
   ```
   postgresql://neondb_owner:npg_yqBKGUZD6iC2@ep-shiny-bar-aeu8xyyh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

### Step 6: Connect Your Domain
1. In Netlify dashboard → **Site settings** → **Domain management**
2. Click **"Add domain"** or **"Connect domain"**
3. Enter your domain name
4. Update your domain's nameservers to Netlify (if required)
5. Or add Netlify's DNS records to your current provider

### Step 7: Deploy!
Once GitHub is connected, every time you push to `main`:
```powershell
git add .
git commit -m "Your changes"
git push origin main
```

Netlify will automatically:
- Pull the latest code
- Install dependencies (`npm install`)
- Run build command (`npm run build`)
- Deploy to your domain
- Show build logs and status

## ✨ Deployment Checklist

- [ ] Git initialized locally
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Netlify site created from GitHub
- [ ] Build settings configured
- [ ] Environment variables added (`DATABASE_URL`)
- [ ] Domain connected
- [ ] First deployment successful
- [ ] Site accessible on your domain

## 📊 Build Status
Check your build status anytime:
1. Go to [app.netlify.com](https://app.netlify.com)
2. Select your site
3. View deployment history
4. Check build logs if needed

## 🔄 Continuous Deployment Setup
Your `netlify.toml` is configured with:
- ✓ Automatic builds on every push
- ✓ Caching headers for performance
- ✓ Security headers enabled
- ✓ Proper redirects for SPA routing

## 🛠️ Troubleshooting

### Build fails with "Cannot find module"
```powershell
# Delete node_modules and package-lock.json, rebuild
rm -r node_modules
rm package-lock.json
npm install
npm run build
```

### Site shows 404
- Check that `publish = "dist"` in `netlify.toml`
- Verify build completed successfully in Netlify logs
- Clear browser cache

### Database connection fails
- Verify `DATABASE_URL` in Netlify environment variables
- Check that connection string includes all parameters
- Test connection locally first

### Domain not working
- Wait 24-48 hours for DNS propagation
- Check nameserver settings in your domain registrar
- Verify domain added in Netlify settings

## 📞 Support
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Astro: [docs.astro.build](https://docs.astro.build)

---

**Your site is ready to deploy!** Follow the steps above to get FlowerLighting live on your domain. 🎉
