import { Card, CardContent } from '@/components/ui/card';
import { SectionTitle } from '@/components/ui/section-title';
import { valuePillars } from '@/data/site';
import { 
  UserCheck, 
  BookOpen, 
  Users, 
  Zap,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  UserCheck,
  BookOpen,
  Users,
  Zap,
};

export function ValuePillars() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Mengapa Pilih MarkasAI"
          title="4 Pilar Utama Kami"
          description="Komitmen kami untuk memberikan solusi AI terbaik bagi bisnis Anda"
          centered
          className="mb-16"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valuePillars.map((pillar, index) => {
            const Icon = iconMap[pillar.icon] || Zap; // Fallback to Zap icon if not found

            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift group shimmer">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-markasai-gold rounded-2xl flex items-center justify-center shadow-lg glow-markasai float-animation" style={{animationDelay: `${index * 0.5}s`}}>
                    {Icon && <Icon className="w-8 h-8 text-white drop-shadow-sm" />}
                  </div>

                  <h3 className="text-xl font-bold">
                    {pillar.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
