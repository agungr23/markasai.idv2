import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Terms of Service - MarkasAI',
  description: 'Syarat dan ketentuan penggunaan layanan MarkasAI.',
  robots: 'noindex, nofollow',
};

export default function TermsPage() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 prose prose-lg max-w-none">
              <h2>1. Penerimaan Syarat</h2>
              <p>
                Dengan mengakses dan menggunakan layanan MarkasAI, Anda menyetujui untuk 
                terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan 
                syarat ini, mohon tidak menggunakan layanan kami.
              </p>

              <h2>2. Deskripsi Layanan</h2>
              <p>
                MarkasAI menyediakan platform dan tools berbasis artificial intelligence 
                untuk membantu bisnis meningkatkan efektivitas dan efisiensi operasional.
              </p>

              <h2>3. Akun Pengguna</h2>
              <ul>
                <li>Anda bertanggung jawab untuk menjaga keamanan akun Anda</li>
                <li>Informasi yang Anda berikan harus akurat dan terkini</li>
                <li>Anda tidak boleh berbagi kredensial akun dengan pihak lain</li>
                <li>Kami berhak menangguhkan akun yang melanggar ketentuan</li>
              </ul>

              <h2>4. Penggunaan yang Diizinkan</h2>
              <p>Anda diizinkan untuk:</p>
              <ul>
                <li>Menggunakan layanan sesuai dengan tujuan bisnis yang sah</li>
                <li>Mengakses dan menggunakan fitur yang tersedia dalam paket Anda</li>
                <li>Mengintegrasikan layanan dengan sistem bisnis Anda</li>
              </ul>

              <h2>5. Penggunaan yang Dilarang</h2>
              <p>Anda tidak diizinkan untuk:</p>
              <ul>
                <li>Menggunakan layanan untuk tujuan ilegal atau tidak etis</li>
                <li>Mencoba mengakses sistem atau data yang tidak diotorisasi</li>
                <li>Mengganggu atau merusak infrastruktur layanan</li>
                <li>Melanggar hak kekayaan intelektual</li>
                <li>Menyebarkan malware atau konten berbahaya</li>
              </ul>

              <h2>6. Pembayaran dan Penagihan</h2>
              <ul>
                <li>Pembayaran dilakukan sesuai dengan paket yang dipilih</li>
                <li>Tagihan akan diproses secara otomatis sesuai siklus billing</li>
                <li>Kegagalan pembayaran dapat mengakibatkan penangguhan layanan</li>
                <li>Refund tersedia sesuai dengan kebijakan yang berlaku</li>
              </ul>

              <h2>7. Kekayaan Intelektual</h2>
              <p>
                Semua hak kekayaan intelektual terkait layanan MarkasAI tetap menjadi 
                milik kami. Anda diberikan lisensi terbatas untuk menggunakan layanan 
                sesuai dengan ketentuan ini.
              </p>

              <h2>8. Privasi dan Data</h2>
              <p>
                Penggunaan data Anda diatur oleh Kebijakan Privasi kami. Kami berkomitmen 
                untuk melindungi privasi dan keamanan data Anda.
              </p>

              <h2>9. Penafian Jaminan</h2>
              <p>
                Layanan disediakan &ldquo;sebagaimana adanya&rdquo; tanpa jaminan tersurat atau tersirat.
                Kami tidak menjamin bahwa layanan akan selalu tersedia atau bebas dari kesalahan.
              </p>

              <h2>10. Batasan Tanggung Jawab</h2>
              <p>
                Dalam batas yang diizinkan oleh hukum, kami tidak bertanggung jawab atas 
                kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari 
                penggunaan layanan.
              </p>

              <h2>11. Penghentian</h2>
              <p>
                Kami berhak menghentikan atau menangguhkan akses Anda ke layanan jika 
                Anda melanggar ketentuan ini atau untuk alasan bisnis yang sah.
              </p>

              <h2>12. Perubahan Ketentuan</h2>
              <p>
                Kami dapat mengubah ketentuan ini dari waktu ke waktu. Perubahan akan 
                diberitahukan melalui email atau pemberitahuan di platform.
              </p>

              <h2>13. Hukum yang Berlaku</h2>
              <p>
                Ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa 
                akan diselesaikan melalui pengadilan yang berwenang di Jakarta.
              </p>

              <h2>14. Hubungi Kami</h2>
              <p>
                Jika Anda memiliki pertanyaan tentang ketentuan ini, 
                silakan hubungi kami di:
              </p>
              <ul>
                <li>Email: legal@markasai.id</li>
                <li>Alamat: Jakarta, Indonesia</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
