# 🚀 Deploying Rakshabandhan Webapp on Render

This guide will help you deploy your beautiful Rakshabandhan webapp on Render.

## 📋 Prerequisites

1. **GitHub Account**: Make sure your code is in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)

## 🎯 Deployment Steps

### Step 1: Prepare Your Repository

1. **Push to GitHub**: Make sure all your files are committed and pushed to GitHub
2. **Verify Files**: Ensure these files are in your repository:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `package.json`
   - `render.yaml`
   - Your photo files (IMG-20250727-WA0001.jpg, etc.)

### Step 2: Deploy on Render

#### Option A: Using render.yaml (Recommended)

1. **Go to Render Dashboard**: Visit [dashboard.render.com](https://dashboard.render.com)
2. **New Static Site**: Click "New" → "Static Site"
3. **Connect Repository**: Connect your GitHub repository
4. **Auto-Deploy**: Render will automatically detect the `render.yaml` file
5. **Deploy**: Click "Create Static Site"

#### Option B: Manual Configuration

1. **Go to Render Dashboard**: Visit [dashboard.render.com](https://dashboard.render.com)
2. **New Static Site**: Click "New" → "Static Site"
3. **Connect Repository**: Connect your GitHub repository
4. **Configure Settings**:
   - **Name**: `rakhi-2k25`
   - **Build Command**: `npm install`
   - **Publish Directory**: `.` (root directory)
   - **Environment**: `Static Site`
5. **Deploy**: Click "Create Static Site"

### Step 3: Configure Domain (Optional)

1. **Custom Domain**: In your Render dashboard, go to your site settings
2. **Add Domain**: Add a custom domain if you have one
3. **SSL**: Render automatically provides SSL certificates

## 🔧 Configuration Details

### Package.json
- **Start Script**: `serve -s . -p $PORT` (serves static files)
- **Dependencies**: Uses `serve` package for static file serving
- **Node Version**: Requires Node.js 16+

### Render.yaml
- **Service Type**: Static site
- **Auto Deploy**: Enabled for main branch
- **Environment**: Production

## 🌐 Access Your Site

Once deployed, you'll get a URL like:
```
https://rakhi-2k25.onrender.com
```

## 📱 Features After Deployment

✅ **Fully Functional**: All features work on the live site
✅ **Photo Upload**: Sister can upload photos (stored in browser)
✅ **Photo Deletion**: Can delete uploaded photos
✅ **Responsive**: Works on all devices
✅ **HTTPS**: Secure connection
✅ **Fast Loading**: Optimized for performance

## 🔄 Updates

To update your site:
1. **Make Changes**: Edit your local files
2. **Commit & Push**: Push to GitHub
3. **Auto Deploy**: Render automatically redeploys

## 🎉 Your Sister's Experience

Your sister will be able to:
- **View the beautiful webapp** on any device
- **Upload her own photos** to the gallery
- **Delete photos** she doesn't want
- **Enjoy the interactive experience** with animations
- **Share the URL** with family and friends

## 💡 Tips

- **Test Locally**: Run `npm run dev` to test before deploying
- **Check Photos**: Ensure all photo files are included in the repository
- **Monitor**: Check Render dashboard for any deployment issues
- **Backup**: Keep a local copy of all files

## 🆘 Troubleshooting

**Site not loading?**
- Check if all files are in the repository
- Verify the build command in Render settings
- Check Render logs for errors

**Photos not showing?**
- Ensure photo files are committed to GitHub
- Check file paths in HTML
- Verify file permissions

**Upload not working?**
- This is normal - uploads are stored in browser localStorage
- Each user will have their own photo collection

---

**Happy Deploying! 🎀💖**

Your Rakshabandhan surprise will be live and accessible to your sister from anywhere in the world! 