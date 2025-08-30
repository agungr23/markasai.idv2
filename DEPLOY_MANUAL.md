# Manual Deployment untuk Domainesia

## 🔧 Jika npm install gagal di server, gunakan cara manual:

### 1. Build di Local
```bash
# Di komputer Anda
pnpm install
pnpm build

# Ganti ke npm dependencies
npm install --production
```

### 2. Upload Files yang Diperlukan
Upload folder berikut ke Domainesia:
```
public_html/
├── .next/           # Build output (WAJIB)
├── public/          # Static files
├── node_modules/    # Dependencies (pre-built)
├── server.js        # Server file
├── package.json     # Production package.json
├── next.config.ts   # Next.js config
└── data/           # JSON data files
```

### 3. Domainesia Settings
- **Node.js version:** 18.x
- **Application root:** `/home/username/public_html`
- **Startup file:** `server.js`
- **Environment variables:**
  - `NODE_ENV=production`
  - `PORT=3000`

### 4. Alternative Startup Files

#### Option A: Direct Next.js
**Startup file:** `node_modules/.bin/next`
**Startup args:** `start`

#### Option B: Simple Server
**Startup file:** `server-simple.js`

```javascript
// server-simple.js
require('next/dist/server/next-server').NextServer({
  dev: false,
  conf: require('./next.config.js')
}).prepare().then(handle => {
  require('http').createServer(handle).listen(3000);
});
```

### 5. Troubleshooting

#### Error: "Module not found"
- Pastikan semua dependencies ada di node_modules
- Upload ulang folder node_modules yang complete

#### Error: "Cannot read property"
- Check file permissions: folders 755, files 644
- Restart Node.js application

#### Error: "Build failed"
- Upload folder .next yang sudah di-build di local
- Jangan build ulang di server

### 6. File Size Optimization
```bash
# Compress large folders before upload
tar -czf node_modules.tar.gz node_modules/
tar -czf next-build.tar.gz .next/
```

Upload terpisah dan extract di server jika file terlalu besar.