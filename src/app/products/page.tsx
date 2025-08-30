import { ProductGridWrapper } from '@/components/sections/product-grid-wrapper';

export default function ProductsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-gradient-shopee-tiktok">
                Solusi AI
              </span>{' '}
              untuk Setiap Kebutuhan Bisnis
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Pilih dari koleksi lengkap produk AI kami yang dirancang khusus untuk 
              mengoptimalkan berbagai aspek bisnis Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <ProductGridWrapper
        title="Semua Produk AI"
        subtitle="Katalog Lengkap"
        description="Temukan solusi AI yang tepat untuk kebutuhan spesifik bisnis Anda"
        showAll={true}
      />

      {/* Categories Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Kategori Produk</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Produk AI kami dikelompokkan berdasarkan fungsi bisnis untuk memudahkan Anda menemukan solusi yang tepat.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Video & Content',
                description: 'Solusi AI untuk pembuatan konten visual dan video',
                count: '1 Produk'
              },
              {
                title: 'Business Operations',
                description: 'Otomatisasi operasional dan manajemen bisnis',
                count: '1 Produk'
              },
              {
                title: 'Marketing & Sales',
                description: 'AI untuk optimasi marketing dan penjualan',
                count: '1 Produk'
              },
              {
                title: 'Customer Service',
                description: 'Layanan pelanggan otomatis dan cerdas',
                count: '1 Produk'
              }
            ].map((category, index) => (
              <div key={index} className="bg-background rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="font-bold text-lg mb-2">{category.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
