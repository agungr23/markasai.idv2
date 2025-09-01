# Media Upload - Troubleshooting Guide

## 🎯 **Overview**
Panduan lengkap untuk mengatasi masalah upload media di MarkasAI website.

## 🔧 **Setup Requirements**

### **Environment Variables (Production Only)**
```bash
# Required di Vercel Dashboard → Environment Variables
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### **How to Get BLOB_READ_WRITE_TOKEN:**
1. Login ke Vercel Dashboard
2. Go to Project → Storage Tab
3. Create Blob Database (jika belum ada)
4. Copy `BLOB_READ_WRITE_TOKEN` dari settings
5. Add ke Environment Variables di project

## 🚀 **Environment Behavior**

### **Development Mode (`pnpm dev`):**
- ✅ File upload ke folder `public/media/`
- ✅ Local file system storage
- ✅ Instant preview
- ⚠️ Files akan hilang saat redeploy

### **Production Mode (Vercel):**
- ✅ File upload ke Vercel Blob CDN
- ✅ Persistent storage across deployments
- ✅ Global CDN delivery
- ✅ Automatic file optimization

### **Other Hosting:**
- ❌ File upload tidak didukung
- ✅ Fallback ke JSON storage
- ⚠️ Media management terbatas

## 🐛 **Common Issues & Solutions**

### **1. "File upload will be available after Vercel Blob setup"**
**Cause:** Using old temporary API implementation
**Solution:** ✅ Fixed - API sudah diupdate untuk menggunakan Vercel Blob

### **2. "BLOB_READ_WRITE_TOKEN tidak ditemukan"**
**Cause:** Environment variable belum di-set
**Solution:**
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add `BLOB_READ_WRITE_TOKEN` with value dari Blob storage
3. Redeploy project

### **3. "BLOB_READ_WRITE_TOKEN tidak valid"**
**Cause:** Token expired atau salah
**Solution:**
1. Generate new token di Vercel Blob dashboard
2. Update environment variable
3. Redeploy project

### **4. "File terlalu besar"**
**Cause:** File size melebihi limit 50MB
**Solution:**
1. Compress image/video sebelum upload
2. Use online compression tools
3. Split large files jika memungkinkan

### **5. "@vercel/blob module tidak tersedia"**
**Cause:** Dependency belum terinstall
**Solution:** ✅ Fixed - `@vercel/blob@0.23.4` sudah ditambahkan ke package.json

## 🧪 **Testing Upload**

### **Development Testing:**
```bash
# Start development server
pnpm dev

# Test upload via admin interface
# Go to: http://localhost:3000/admin/media
# Upload file should work dengan local storage
```

### **Production Testing:**
```bash
# After deploy to Vercel with BLOB_READ_WRITE_TOKEN
# Go to: https://your-app.vercel.app/admin/media
# Upload file should work dengan Vercel Blob
```

## 📊 **Upload Flow**

### **Development Flow:**
1. User selects file in admin interface
2. File sent to `/api/upload`
3. API detects development environment
4. File saved to `public/media/` directory
5. Media entry saved to JSON storage
6. Success response with local URL

### **Production Flow:**
1. User selects file in admin interface
2. File sent to `/api/upload`
3. API detects Vercel production environment
4. File uploaded to Vercel Blob storage
5. CDN URL returned from Blob
6. Media entry saved to Blob storage
7. Success response with CDN URL

## 🔍 **Debug Information**

### **Check Environment:**
```javascript
// In browser console or API response
fetch('/api/debug/storage?action=health')
  .then(r => r.json())
  .then(console.log);
```

### **Expected Response (Development):**
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

### **Expected Response (Production):**
```json
{
  "success": true,
  "health": {
    "environment": {
      "isProduction": true,
      "isServerless": true,
      "runtime": "edge"
    }
  }
}
```

## 🎉 **Success Indicators**

### **Development Success:**
- ✅ File appears in `public/media/` folder
- ✅ File listed in admin media library
- ✅ Preview works correctly
- ✅ File accessible via `/media/filename`

### **Production Success:**
- ✅ File uploaded to Vercel Blob
- ✅ CDN URL generated (blob.vercel-storage.com)
- ✅ File listed in admin media library
- ✅ Preview works globally
- ✅ Fast loading via CDN

## 🚨 **Emergency Solutions**

### **If Upload Completely Fails:**
1. Use external image hosting (Imgur, Cloudinary)
2. Add media entries manually via admin interface
3. Use static images in `public/images/` folder
4. Contact Vercel support for Blob issues

### **Fallback Strategy:**
1. Prepare backup images in `public/images/`
2. Use placeholder images saat upload failed
3. Implement retry mechanism for failed uploads
4. Show clear error messages to users

## 📈 **Performance Optimization**

### **File Size Recommendations:**
- **Images:** Max 5MB, WebP format preferred
- **Videos:** Max 20MB, MP4 format preferred
- **Documents:** Max 10MB, PDF format preferred

### **Best Practices:**
1. Compress images before upload
2. Use appropriate file formats
3. Implement progress indicators
4. Show file size limits in UI
5. Validate file types on client and server

## 🔧 **Current Status**
- ✅ Upload API updated untuk Vercel Blob
- ✅ Media API integrated dengan Blob storage
- ✅ Delete API supports blob file removal
- ✅ Environment-aware upload handling
- ✅ Improved error messages dan debugging
- ✅ Ready for production deployment

## 📞 **Need Help?**
Jika masih ada masalah upload:
1. Check environment variables di Vercel
2. Verify Blob storage setup
3. Test dengan file kecil (< 1MB) dulu
4. Check browser console untuk error details
5. Contact technical support dengan error logs