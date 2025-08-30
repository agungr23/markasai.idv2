import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Privacy Policy - MarkasAI',
  description: 'Kebijakan privasi MarkasAI mengenai pengumpulan, penggunaan, dan perlindungan data pribadi pengguna.',
  robots: 'noindex, nofollow',
};

export default function PrivacyPage() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 prose prose-lg max-w-none">
              <h2>1. Informasi yang Kami Kumpulkan</h2>
              <p>
                MarkasAI mengumpulkan informasi yang Anda berikan secara langsung kepada kami, 
                seperti ketika Anda membuat akun, menggunakan layanan kami, atau menghubungi kami.
              </p>

              <h3>Informasi Pribadi</h3>
              <ul>
                <li>Nama lengkap</li>
                <li>Alamat email</li>
                <li>Nomor telepon</li>
                <li>Informasi perusahaan</li>
                <li>Data penggunaan layanan</li>
              </ul>

              <h2>2. Bagaimana Kami Menggunakan Informasi</h2>
              <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
              <ul>
                <li>Menyediakan dan memelihara layanan kami</li>
                <li>Memproses transaksi dan mengirim konfirmasi</li>
                <li>Mengirim komunikasi terkait layanan</li>
                <li>Meningkatkan dan mengembangkan layanan</li>
                <li>Memberikan dukungan pelanggan</li>
              </ul>

              <h2>3. Berbagi Informasi</h2>
              <p>
                Kami tidak menjual, memperdagangkan, atau mentransfer informasi pribadi Anda 
                kepada pihak ketiga tanpa persetujuan Anda, kecuali dalam situasi berikut:
              </p>
              <ul>
                <li>Dengan persetujuan eksplisit Anda</li>
                <li>Untuk mematuhi kewajiban hukum</li>
                <li>Untuk melindungi hak dan keamanan kami</li>
                <li>Dengan penyedia layanan tepercaya yang membantu operasi kami</li>
              </ul>

              <h2>4. Keamanan Data</h2>
              <p>
                Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi 
                informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah.
              </p>

              <h2>5. Hak Anda</h2>
              <p>Anda memiliki hak untuk:</p>
              <ul>
                <li>Mengakses informasi pribadi yang kami miliki tentang Anda</li>
                <li>Meminta koreksi informasi yang tidak akurat</li>
                <li>Meminta penghapusan informasi pribadi Anda</li>
                <li>Menolak pemrosesan informasi pribadi Anda</li>
                <li>Meminta portabilitas data</li>
              </ul>

              <h2>6. Cookies</h2>
              <p>
                Kami menggunakan cookies dan teknologi serupa untuk meningkatkan pengalaman 
                pengguna, menganalisis lalu lintas, dan mempersonalisasi konten.
              </p>

              <h2>7. Perubahan Kebijakan</h2>
              <p>
                Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. 
                Perubahan akan diposting di halaman ini dengan tanggal pembaruan yang baru.
              </p>

              <h2>8. Hubungi Kami</h2>
              <p>
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, 
                silakan hubungi kami di:
              </p>
              <ul>
                <li>Email: privacy@markasai.id</li>
                <li>Alamat: Jakarta, Indonesia</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
