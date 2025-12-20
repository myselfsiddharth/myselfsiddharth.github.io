# Siddharth Mehta - Portfolio Website

A modern, cyberpunk-themed portfolio website showcasing projects, experience, and skills.

## 🚀 Deployment to GitHub Pages

This is a **static website** that can be easily hosted on GitHub Pages.

### Quick Setup:

1. **Create a GitHub repository** (if you haven't already)
   - Repository name: `username.github.io` (replace `username` with your GitHub username)
   - Make it public

2. **Push your files to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/username.github.io.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**

4. **Your site will be live at:** `https://username.github.io`

## 📁 File Structure

```
.
├── index.html          # Main HTML file
├── style.css           # Stylesheet
├── script.js           # JavaScript functionality
├── cyber-scene.js      # Three.js 3D background scene
├── .nojekyll          # Prevents Jekyll processing
└── README.md          # This file
```

## ✨ Features

- **Fully Static** - No build process required
- **Responsive Design** - Works on all devices
- **3D Background** - Interactive Three.js scene
- **Resume Modal** - Embedded PDF viewer
- **Smooth Animations** - Cyberpunk-themed transitions
- **Easter Eggs** - Hidden interactive features

## 🔧 Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Three.js (3D graphics)
- Lucide Icons
- EmailJS (for contact form if needed)
- Google Fonts (Orbitron, JetBrains Mono)

## 📝 Notes

- All external resources are loaded via CDN
- No server-side code required
- Works perfectly on GitHub Pages
- The `.nojekyll` file ensures GitHub Pages serves files as-is without Jekyll processing

## 🐛 Troubleshooting

If your site doesn't load:
1. Check that GitHub Pages is enabled in repository settings
2. Ensure your repository is public (required for free GitHub Pages)
3. Wait a few minutes after pushing - GitHub Pages can take a moment to update
4. Clear your browser cache and try again

---

Built with ❤️ by Siddharth Mehta
