import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Wrench, 
  Clock, 
  Mail, 
  ArrowLeft,
  Settings
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Website Sedang Maintenance - MarkasAI',
  description: 'Website sedang dalam tahap maintenance. Kami akan segera kembali.',
  robots: 'noindex, nofollow',
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12 text-center space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Wrench className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <Settings className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Website Sedang
                <span className="block text-gradient-markasai">Maintenance</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
                Kami sedang melakukan pemeliharaan untuk memberikan pengalaman yang lebih baik
              </p>
            </div>

            {/* Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Status Maintenance</span>
              </div>
              <p className="text-blue-800">
                Website akan segera kembali normal. Terima kasih atas kesabaran Anda.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Butuh bantuan segera?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline" className="gap-2">
                  <a href="mailto:hello@markasai.id">
                    <Mail className="w-4 h-4" />
                    hello@markasai.id
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Back to Home */}
            <div className="pt-6 border-t">
              <Button asChild className="btn-gradient-markasai gap-2">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            © 2024 MarkasAI. Maintenance Mode Active.
          </p>
        </div>
      </div>
    </div>
  );
}
