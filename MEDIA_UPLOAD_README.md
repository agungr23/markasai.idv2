# Media Upload Behavior

## Development Mode (`pnpm dev`)
✅ **File upload benar-benar berfungsi:**
- File disimpan ke folder `public/media/`
- Data tersimpan di `data/media.json`
- CRUD lengkap berfungsi (Create, Read, Update, Delete)
- File fisik dapat diakses di browser

## Production Mode (`pnpm build` + `pnpm start`)
⚠️ **Keterbatasan upload:**
- File TIDAK disimpan ke disk
- Data hanya tersimpan di memory (RAM)
- Ketika server restart, data upload hilang
- Ini karena Edge Runtime compatibility

## Kenapa Seperti Ini?

### Edge Runtime Limitations
- Tidak mendukung `fs.writeFile()` dan operasi file system
- Platform Vercel/Netlify adalah serverless
- Tidak ada persistent file storage

### Solusi Production

#### 1. Cloud Storage (Recommended)
```bash
# Install Cloudinary SDK
pnpm add cloudinary

# Atau AWS S3
pnpm add @aws-sdk/client-s3
```

#### 2. Hybrid Storage
- Development: Local files
- Production: Cloud storage

### Environment Check
```typescript
// Cek apakah dalam development
if (process.env.NODE_ENV === 'development') {
  // Upload ke local file
} else {
  // Upload ke cloud storage
}
```

## Status Saat Ini
- ✅ JSON data management berfungsi
- ✅ Media listing dari JSON
- ✅ Development upload berfungsi  
- ⚠️ Production upload perlu cloud storage

## Next Steps
1. Integrate dengan Cloudinary/AWS S3
2. Environment-aware upload handler
3. Fallback untuk production mode