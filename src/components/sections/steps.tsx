import { SectionTitle } from '@/components/ui/section-title';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Settings, BarChart3 } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Pilih Solusi',
    description: 'Pilih produk AI yang sesuai dengan kebutuhan bisnis Anda dari katalog lengkap kami.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Terapkan',
    description: 'Implementasikan solusi AI dengan bantuan tim support kami yang berpengalaman.',
    icon: Settings,
  },
  {
    number: '03',
    title: 'Ukur Hasil',
    description: 'Monitor performa dan hasil yang dicapai dengan dashboard analytics yang komprehensif.',
    icon: BarChart3,
  },
];

export function Steps() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Cara Kerja"
          title="3 Langkah Mudah"
          description="Proses sederhana untuk mengintegrasikan AI dalam bisnis Anda"
          centered
          className="mb-16"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <div key={index} className="relative">
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8 text-center space-y-6">
                    {/* Step Number */}
                    <div className="text-6xl font-bold text-gradient-markasai opacity-30">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="mx-auto w-16 h-16 bg-gradient-markasai-blue rounded-2xl flex items-center justify-center shadow-lg glow-markasai float-animation" style={{animationDelay: `${index * 0.3}s`}}>
                      <Icon className="w-8 h-8 text-white drop-shadow-sm" />
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-markasai-gold-400 to-markasai-blue-800"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-markasai-blue-800 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
