export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Selamat datang di CMS MarkasAI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Blog Posts</h3>
          <p className="text-2xl font-bold text-blue-600">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Produk</h3>
          <p className="text-2xl font-bold text-green-600">4</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Case Studies</h3>
          <p className="text-2xl font-bold text-purple-600">8</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Testimonials</h3>
          <p className="text-2xl font-bold text-orange-600">15</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a 
            href="/admin/blog/new"
            className="p-4 border rounded-lg hover:bg-gray-50 text-center"
          >
            <div className="text-blue-600 font-medium">Tulis Blog Post</div>
            <div className="text-sm text-gray-500">Buat artikel baru</div>
          </a>
          
          <a 
            href="/admin/products/new"
            className="p-4 border rounded-lg hover:bg-gray-50 text-center"
          >
            <div className="text-green-600 font-medium">Tambah Produk</div>
            <div className="text-sm text-gray-500">Produk AI baru</div>
          </a>
          
          <a 
            href="/admin/case-studies/new"
            className="p-4 border rounded-lg hover:bg-gray-50 text-center"
          >
            <div className="text-purple-600 font-medium">Case Study</div>
            <div className="text-sm text-gray-500">Success story baru</div>
          </a>
          
          <a 
            href="/admin/settings"
            className="p-4 border rounded-lg hover:bg-gray-50 text-center"
          >
            <div className="text-gray-600 font-medium">Pengaturan</div>
            <div className="text-sm text-gray-500">Konfigurasi website</div>
          </a>
        </div>
      </div>
    </div>
  );
}
