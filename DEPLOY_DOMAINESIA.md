# Panduan Deployment ke Domainesia

## 🚀 Cara Deploy Website ke Domainesia

### Opsi 1: Static Export (Recommended)

#### 1. Build untuk Domainesia
```bash
# Build website untuk static export
pnpm build:domainesia

# Atau manual step-by-step
pnpm build
pnpm export:domainesia
```

#### 2. Upload ke Domainesia
1. Buka **File Manager** di cPanel Domainesia
2. Masuk ke folder **public_html** (atau subdomain folder)
3. Upload semua file dari folder **out/** ke public_html
4. Website sudah live!

### Opsi 2: Node.js Hosting (Full Featured)

Jika Domainesia support Node.js hosting:

#### 1. Upload Source Code
```bash
# Compress project (exclude node_modules)
zip -r markasai-website.zip . -x "node_modules/*" ".next/*" "out/*"
```

#### 2. Setup di Server
```bash
# Install dependencies
npm install
# atau
pnpm install

# Build project
npm run build

# Start production server
npm start
```

## 📁 Struktur File untuk Upload

### Static Export (Folder out/)
```
public_html/
├── _next/           # Next.js assets
├── api/            # API routes (static)
├── images/         # Gambar website
├── media/          # Media uploads
├── case-studies/   # Halaman case studies
├── blog/           # Halaman blog
├── 404.html        # Error page
├── index.html      # Homepage
└── ...
```

## 🔧 Konfigurasi Khusus Domainesia

### Domain Setup
1. **Domain utama:** Upload ke `public_html/`
2. **Subdomain:** Upload ke `public_html/subdomain/`

### File Permissions
- Folder: **755**
- File: **644**

### .htaccess (Opsional)
```apache
# Redirect all requests to HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle client-side routing
RewriteEngine On
RewriteRule ^([^.]+)$ $1.html [NC,L]
```

## 📊 Media Upload di Domainesia

### Static Export
- ❌ Media upload tidak berfungsi (read-only)
- ✅ Media existing tetap bisa diakses
- 💡 **Solusi:** Upload manual via File Manager

### Node.js Hosting  
- ✅ Media upload berfungsi penuh
- ✅ CRUD media berfungsi
- ✅ File tersimpan di server

## 🛠️ Troubleshooting

### Error: "404 Not Found"
```bash
# Pastikan semua file .html ada
ls out/*.html

# Check .htaccess rules
```

### Error: "Images not loading"
```bash
# Check image paths
# Gunakan relative paths: ./images/ bukan /images/
```

### Performance Issues
```bash
# Optimize images before upload
# Compress files menggunakan gzip
```

## 📋 Checklist Deployment

- [ ] Build website: `pnpm build:domainesia`
- [ ] Test local: buka folder `out/`
- [ ] Upload ke Domainesia File Manager
- [ ] Set file permissions (755/644)
- [ ] Test domain: buka website
- [ ] Check all pages berfungsi
- [ ] Test contact form
- [ ] Check mobile responsiveness

## 🎯 Status Media Upload

| Mode | Domainesia Shared | Domainesia VPS | Domainesia Node.js |
|------|------------------|---------------|-------------------|
| Static Export | ❌ Upload disabled | ❌ Upload disabled | ❌ Upload disabled |
| Server Hosting | ✅ Full upload | ✅ Full upload | ✅ Full upload |

**Kesimpulan:** Untuk media upload yang berfungsi, gunakan Node.js hosting atau VPS di Domainesia.