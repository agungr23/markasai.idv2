# 🚀 Deploy ke Vercel - Panduan Lengkap

## Method 1: Deploy via GitHub (Recommended)

### 1. **Push ke GitHub**
```bash
# Add semua file
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. **Connect ke Vercel**
1. Buka [vercel.com](https://vercel.com)
2. Sign up/Login dengan GitHub account
3. Klik **"New Project"**
4. Import repository `markasai.idv2`
5. Vercel akan auto-detect Next.js

### 3. **Konfigurasi Project**
- **Framework Preset:** Next.js
- **Root Directory:** `./` (default)
- **Build Command:** `next build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` atau `pnpm install`

### 4. **Environment Variables**
Tambahkan di Vercel dashboard:
- `NODE_ENV` = `production`
- `NEXT_TELEMETRY_DISABLED` = `1`

### 5. **Deploy**
Klik **Deploy** - Vercel akan build otomatis!

---

## Method 2: Deploy via Vercel CLI

### 1. **Install Vercel CLI**
```bash
npm i -g vercel
# atau
pnpm add -g vercel
```

### 2. **Login ke Vercel**
```bash
vercel login
```

### 3. **Deploy**
```bash
# Di root project
vercel

# Untuk production deployment
vercel --prod
```

---

## 🔧 Konfigurasi Khusus

### Custom Domain
1. Di Vercel dashboard → Project Settings → Domains
2. Add domain: `markasai.id`
3. Update DNS records di registrar:
   - Type: `A` Record
   - Value: `76.76.19.61` (Vercel IP)
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

### Build Optimization
```json
// vercel.json sudah dikonfigurasi untuk:
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30  // 30 detik timeout
    }
  }
}
```

---

## 🎯 Keuntungan Vercel vs Domainesia

| Feature | Vercel | Domainesia |
|---------|---------|------------|
| **Deployment** | ✅ Git push auto-deploy | ❌ Manual upload |
| **Build Process** | ✅ Otomatis di cloud | ❌ Manual/error-prone |
| **CDN** | ✅ Global CDN | ❌ Single location |
| **Media Upload** | ⚠️ Memory only | ✅ Persistent files |
| **API Routes** | ✅ Serverless functions | ✅ Full Node.js |
| **Performance** | ✅ Optimized for Next.js | ⚠️ Generic hosting |
| **SSL** | ✅ Auto SSL | ✅ Let's Encrypt |
| **Cost** | ✅ Free tier generous | 💰 Paid hosting |

---

## 📊 Status Media Upload di Vercel

### Current Implementation:
- ✅ **Media listing berfungsi** (dari JSON data)
- ✅ **Media CRUD berfungsi** (in-memory)
- ⚠️ **File upload** tersimpan di memory
- ❌ **Files hilang** saat serverless function restart

### Production-Ready Solution:
Untuk media upload yang persistent, integrasikan dengan:

#### 1. **Cloudinary (Recommended)**
```bash
npm install cloudinary
```

#### 2. **AWS S3**
```bash
npm install @aws-sdk/client-s3
```

#### 3. **Vercel Blob Storage**
```bash
npm install @vercel/blob
```

---

## 🚀 Quick Start Commands

```bash
# 1. Final check
pnpm build

# 2. Deploy to Vercel
vercel --prod

# 3. Check deployment
vercel ls
```

---

## 🔍 Troubleshooting

### Build Error
```bash
# Check build locally first
pnpm build
```

### Environment Issues
- Pastikan environment variables set di Vercel dashboard
- Check di Project Settings → Environment Variables

### Custom Domain Issues
- Tunggu DNS propagation (24-48 jam)
- Check DNS settings dengan `dig` atau online DNS checker

---

## ✅ Post-Deployment Checklist

- [ ] Website accessible di domain
- [ ] All pages load correctly
- [ ] Contact form berfungsi
- [ ] CMS admin accessible
- [ ] Media listing shows data
- [ ] SEO metadata correct
- [ ] Mobile responsive
- [ ] Core Web Vitals good

**Next Step:** Setup cloud storage untuk persistent media uploads!