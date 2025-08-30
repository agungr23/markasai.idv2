export function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        <a
          href="/admin"
          className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
        >
          Dashboard
        </a>

        <div className="space-y-1">
          <div className="px-3 py-2 text-sm font-medium text-gray-700">Blog</div>
          <a
            href="/admin/blog"
            className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Semua Posts
          </a>
          <a
            href="/admin/blog/new"
            className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Tulis Baru
          </a>
        </div>

        <div className="space-y-1">
          <div className="px-3 py-2 text-sm font-medium text-gray-700">Produk</div>
          <a
            href="/admin/products"
            className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Semua Produk
          </a>
          <a
            href="/admin/products/new"
            className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Tambah Produk
          </a>
        </div>

        <div className="space-y-1">
          <div className="px-3 py-2 text-sm font-medium text-gray-700">Case Studies</div>
          <a
            href="/admin/case-studies"
            className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Semua Case Studies
          </a>
          <a
            href="/admin/case-studies/new"
            className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Tambah Baru
          </a>
        </div>

        <a
          href="/admin/testimonials"
          className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
        >
          Testimonials
        </a>

        <a
          href="/admin/media"
          className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
        >
          Media
        </a>

        <a
          href="/admin/settings"
          className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
        >
          Pengaturan Situs
        </a>
      </nav>
    </aside>
  );
}


