# Resume Link Configuration

## Overview
Your portfolio website now uses a centralized `resumeLink` variable to manage all resume download links. This makes it easy to update your resume link in one place.

## How to Update Your Resume Link

### 1. Locate the Variable
Open `script.js` and find this line near the top:
```javascript
const resumeLink = 'resume.pdf';
```

### 2. Update the Link
Replace `'resume.pdf'` with your actual resume link. You can use:
- **Local file**: `'resume.pdf'` (if the file is in the same folder)
- **Google Drive**: `'https://drive.google.com/file/d/YOUR_FILE_ID/view'`
- **Dropbox**: `'https://www.dropbox.com/s/YOUR_FILE_ID/resume.pdf'`
- **OneDrive**: `'https://1drv.ms/b/s!YOUR_SHARE_ID'`
- **Any other URL**: `'https://your-domain.com/resume.pdf'`

### 3. Example Updates
```javascript
// Google Drive (make sure to set sharing to "Anyone with the link can view")
const resumeLink = 'https://drive.google.com/file/d/1ABC123XYZ/view?usp=sharing';

// Dropbox
const resumeLink = 'https://www.dropbox.com/s/abc123def456/resume.pdf?dl=0';

// Local file with different name
const resumeLink = 'Siddharth_Mehta_Resume_2024.pdf';
```

## How It Works

The JavaScript automatically updates all resume links on your website when the page loads. It looks for elements with these CSS classes:
- `.btn-resume` - The main resume button in the hero section
- `.resume-link` - The resume link in the about section  
- `.fab-resume` - The floating action button

## Testing

1. Open `test-resume-links.html` in your browser
2. Open the browser console (F12) to see the current resume link value
3. Click the test links to verify they work correctly
4. Update the `resumeLink` variable and refresh to test different links

## Troubleshooting

- **Links not updating**: Make sure you're editing the correct `script.js` file
- **Console errors**: Check that the JavaScript syntax is correct
- **Links not working**: Verify your resume link URL is accessible and publicly shared
- **File not found**: Ensure the file path is correct if using a local file

## Security Notes

- If using cloud storage (Google Drive, Dropbox, etc.), make sure the file is set to "Anyone with the link can view"
- Consider using a direct download link when possible for better user experience
- Test the link in an incognito/private browser window to ensure it works for visitors 