# Upload Media Debug Test

## Quick Test Checklist

### 1. **Development Server Status:**
- ✅ Server running on http://localhost:3001
- ✅ Build successful (with some warnings)
- ✅ API routes compiled

### 2. **Test Upload via Browser:**
1. Open http://localhost:3001/admin/login
2. Login to admin (password: admin123)
3. Go to http://localhost:3001/admin/media
4. Try uploading a small image file (< 1MB)

### 3. **Check Console Logs:**
Browser console should show:
```
🚀 Upload API called
📁 File received: [filename] size: [size] type: [type]
🌍 Environment: { isProduction: false, isVercel: false, isServerless: false }
🟡 Using local file storage
✅ Local file upload successful: [filename]
```

### 4. **Manual API Test:**
```javascript
// Test upload API directly via browser console
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.onchange = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  console.log('Upload result:', result);
};
fileInput.click();
```

### 5. **Expected Results:**

#### Development Success:
- File saved to `public/media/[timestamp]_[filename]`
- Media entry added to JSON storage
- File appears in admin media library
- Preview works via `/media/[timestamp]_[filename]`

#### Common Errors & Solutions:

**Error: "No file uploaded"**
- Solution: ✅ Fixed - Client now sends 'file' instead of 'files'

**Error: "File upload only available in development mode"**
- Solution: ✅ Fixed - Improved canUseFileSystem() detection

**Error: "Local file upload failed"**
- Check: File system permissions
- Check: `public/media/` directory exists
- Check: Node.js modules (fs, path) available

### 6. **Verify File System:**
Files should appear in:
```
public/
└── media/
    ├── [timestamp]_image1.jpg
    ├── [timestamp]_document.pdf
    └── ...
```

### 7. **Environment Debug:**
Check environment detection:
```
GET /api/debug/storage?action=health
```

Expected response (development):
```json
{
  "success": true,
  "health": {
    "environment": {
      "isProduction": false,
      "isServerless": false,
      "runtime": "nodejs"
    }
  }
}
```

## Status: Ready for Testing! 🚀

All issues should now be resolved:
- ✅ Client-server form data mismatch fixed
- ✅ Improved error handling and logging
- ✅ Environment detection enhanced
- ✅ File system access improved
- ✅ Development server running

Test the upload now at: **http://localhost:3001/admin/media**