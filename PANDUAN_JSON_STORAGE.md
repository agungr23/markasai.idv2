# 📁 Panduan Penggunaan JSON Storage

## 🎯 **Ringkasan Implementasi**

Website MarkasAI.ID sekarang menggunakan **Hybrid Storage System** yang:
- ✅ **Menggunakan file JSON** ketika environment mendukung
- ✅ **Fallback ke memory** untuk Edge Runtime compatibility
- ✅ **Otomatis detect** environment dan pilih strategi terbaik
- ✅ **Tetap kompatibel** untuk deployment di Vercel/Netlify

## 📊 **Cara Kerja Storage**

### **Development Mode (`pnpm dev`)**
```
CMS Data → JSON Files (persistent) + Memory Cache
├── data/blog-posts.json
├── data/case-studies.json  
├── data/testimonials.json
├── data/settings.json
└── public/data/products.json
```

### **Production Mode (`pnpm start`)**
```
Environment Check → 
├── File System Available: JSON Files + Memory
└── Edge Runtime: Memory Only (fallback)
```

## 🔧 **Menggunakan JSON Storage**

### **1. Cek Status Storage**
```bash
# Lihat status dan jumlah data
curl http://localhost:3000/api/storage?action=status
```

Response:
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "storage_type": "hybrid",
  "data_counts": {
    "products": 12,
    "blog-posts": 5,
    "case-studies": 3,
    "testimonials": 8,
    "settings": 15
  }
}
```

### **2. Backup Data ke JSON**
```bash
# Backup semua data
curl http://localhost:3000/api/storage?action=backup&type=all > backup.json

# Backup data tertentu
curl http://localhost:3000/api/storage?action=backup&type=products > products-backup.json
```

### **3. Restore Data dari JSON**
```bash
# Restore data products
curl -X POST "http://localhost:3000/api/storage?action=restore&type=products" \
  -H "Content-Type: application/json" \
  -d @products-backup.json
```

## 📂 **Struktur File JSON**

### **Products (`public/data/products.json`)**
```json
[
  {
    "id": "1",
    "title": "VIDABOT - AI Video Creator",
    "category": "AI Tools",
    "price": "Starting from Rp 299,000/month",
    "description": "...",
    "features": [...],
    "slug": "vidabot-ai-video-creator"
  }
]
```

### **Blog Posts (`data/blog-posts.json`)**
```json
[
  {
    "id": "1",
    "title": "5 Cara AI Mengubah Marketing Digital",
    "slug": "ai-marketing-digital",
    "body": "...",
    "publishedAt": "2024-01-15",
    "status": "published"
  }
]
```

### **Settings (`data/settings.json`)**
```json
{
  "site_title": "MarkasAI.ID - Platform AI Terdepan",
  "contact_email": "hello@markasai.id",
  "social_media": {
    "instagram": "@markasai.id",
    "linkedin": "MarkasAI"
  }
}
```

## 🚀 **Testing Storage**

### **Development Testing**
```bash
# 1. Jalankan development server
pnpm dev

# 2. Login ke admin panel
# http://localhost:3000/admin/login

# 3. Test CRUD operations:
# - Tambah blog post baru
# - Edit product existing  
# - Update settings

# 4. Cek apakah file JSON terupdate
cat data/blog-posts.json
```

### **Production Testing**
```bash
# 1. Build dan jalankan production
pnpm build
pnpm start

# 2. Cek status storage
curl http://localhost:3000/api/storage?action=status

# 3. Test backup functionality
curl http://localhost:3000/api/storage?action=backup&type=all
```

## 💡 **Tips & Best Practices**

### **1. Regular Backup**
```bash
# Script untuk backup harian
#!/bin/bash
DATE=$(date +%Y%m%d)
curl http://localhost:3000/api/storage?action=backup&type=all > "backup-$DATE.json"
```

### **2. Data Migration**
```bash
# Dari development ke production
# 1. Backup dari dev
curl http://dev.markasai.id/api/storage?action=backup&type=all > dev-backup.json

# 2. Restore ke production  
curl -X POST "http://markasai.id/api/storage?action=restore&type=products" \
  -H "Content-Type: application/json" \
  -d @dev-backup.json
```

### **3. Monitoring Storage**
Tambahkan ini ke monitoring dashboard:
```javascript
// Check storage health
fetch('/api/storage?action=status')
  .then(res => res.json())
  .then(data => console.log('Storage Status:', data));
```

## 🔍 **Troubleshooting**

### **Problem: File JSON tidak terupdate**
**Solution:**
1. Cek apakah running di development mode
2. Pastikan folder `data/` dan `public/data/` ada
3. Cek permission write access

### **Problem: Data hilang setelah restart**
**Solution:**
1. Cek di console apakah menggunakan "JSON file" atau "memory only"
2. Kalau memory only → normal untuk serverless deployment
3. Gunakan backup/restore API untuk transfer data

### **Problem: Build error dengan file system**
**Solution:**
- Hybrid storage sudah handle ini otomatis
- Edge Runtime akan fallback ke memory
- Development tetap bisa gunakan JSON file

## 📈 **Hasil yang Diharapkan**

### **✅ Sekarang Anda Punya:**
1. **JSON File Persistence** di development
2. **Memory Fallback** untuk production/serverless  
3. **Backup/Restore** API untuk data management
4. **Universal Compatibility** untuk semua platform
5. **Automatic Environment Detection**

### **🎯 Workflow yang Direkomendasikan:**
1. **Development**: Edit via CMS → otomatis save ke JSON
2. **Backup**: Regular export menggunakan API
3. **Deploy**: Build success tanpa error di semua platform
4. **Production**: Setup data awal via restore API
5. **Maintenance**: Monitor via status API

---

## 🎉 **Ready to Use!**

Storage system sekarang sudah menggunakan JSON file ketika memungkinkan, dengan fallback yang aman untuk semua environment. Data CMS Anda akan persistent di development dan mudah di-backup/restore untuk production! 

```bash
# Test sekarang
pnpm dev
# Login ke /admin/login
# Edit content di CMS  
# Cek file JSON terupdate!
```