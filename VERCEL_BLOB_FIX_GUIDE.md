# Vercel Media Upload Fix - Step by Step Guide

## 🚨 **Current Issue**
Media upload gagal di Vercel dengan error "Vercel Blob upload failed"

## 🔍 **Root Cause Analysis**
1. Environment detection bekerja (menggunakan Vercel Blob di production)
2. Error terjadi saat upload ke Vercel Blob storage
3. Kemungkinan masalah: BLOB_READ_WRITE_TOKEN belum dikonfigurasi dengan benar

## 🛠️ **Solution Steps**

### **Step 1: Setup Vercel Blob Storage**

#### A. Create Blob Storage di Vercel Dashboard
1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project MarkasAI
3. Go to **Storage** tab
4. Click **Create Database** → **Blob**
5. Choose project dan region (pilih yang terdekat dengan target user)
6. Click **Create**

#### B. Get Environment Token
1. Setelah Blob database created, go to **Settings**
2. Copy **BLOB_READ_WRITE_TOKEN** value
3. Token format: `vercel_blob_rw_xxxxxxxxxxxxxxx`

### **Step 2: Configure Environment Variables**

#### A. Set di Vercel Dashboard
1. Go to Project → **Settings** → **Environment Variables**
2. Add new variable:
   ```
   Name: BLOB_READ_WRITE_TOKEN
   Value: vercel_blob_rw_xxxxxxxxxxxxxxx
   Environment: Production
   ```
3. Click **Save**

#### B. Verify Environment Variables
```bash
# Required variables for production:
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxx
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### **Step 3: Deploy & Test**

#### A. Redeploy Project
1. Setelah environment variables diset, redeploy:
   ```bash
   git add .
   git commit -m "Fix Vercel Blob configuration"
   git push origin main
   ```
2. Atau trigger manual deploy di Vercel dashboard

#### B. Test Upload
1. Go to: `https://your-app.vercel.app/admin/media`
2. Login dengan admin credentials
3. Try upload small image file (< 5MB)
4. Check browser console untuk detailed error logs

### **Step 4: Debug If Still Failing**

#### A. Check Environment Variables
```javascript
// Test di browser console:
fetch('/api/debug/storage?action=health')
  .then(r => r.json())
  .then(console.log);
```

Expected response:
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

#### B. Common Error Messages & Solutions

**"BLOB_READ_WRITE_TOKEN tidak ditemukan"**
- ✅ Solution: Set environment variable di Vercel dashboard

**"BLOB_READ_WRITE_TOKEN tidak valid"**
- ✅ Solution: Generate new token dari Blob storage settings

**"Akses ditolak"**
- ✅ Solution: Verify token permissions di Blob settings

**"File terlalu besar"**
- ✅ Solution: Compress file atau split large files

### **Step 5: Verify Success**

#### A. Successful Upload Indicators
- ✅ File uploaded without errors
- ✅ File appears in admin media library
- ✅ File URL uses `blob.vercel-storage.com` domain
- ✅ File accessible globally via CDN

#### B. Check Blob Storage
1. Go to Vercel Dashboard → Storage → Blob
2. Verify uploaded files appear in storage
3. Check storage usage dan limits

## 🎯 **Quick Setup Commands**

```bash
# 1. Ensure latest code is deployed
git add .
git commit -m "Add Vercel Blob support"
git push origin main

# 2. After setting BLOB_READ_WRITE_TOKEN in Vercel:
# Trigger redeploy or wait for auto-deploy

# 3. Test upload at:
# https://your-app.vercel.app/admin/media
```

## 📞 **Need Help?**

Jika masih ada masalah:
1. Check Vercel deployment logs untuk detailed error
2. Verify Blob storage quota tidak terlampaui
3. Test dengan file kecil (< 1MB) dulu
4. Contact Vercel support jika token issues

## 🚀 **Next Action Required**

**Immediate Action:** Set BLOB_READ_WRITE_TOKEN di Vercel Dashboard Environment Variables

Setelah token diset, upload akan bekerja dengan sempurna! 🎉