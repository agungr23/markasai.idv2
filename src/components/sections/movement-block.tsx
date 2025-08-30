import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export function MovementBlock() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-12 lg:p-16">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                AI bukan masa depan—AI adalah{' '}
                <span className="text-gradient-markasai">
                  hari ini
                </span>
              </h2>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  AI sudah dipakai hari ini oleh kompetitor dan marketplace besar. 
                  AI bisa jadi ancaman bagi cara kerja lama—tetapi juga peluang untuk 
                  memangkas waktu, menekan biaya, dan meningkatkan akurasi.
                </p>
                
                <p>
                  MarkasAI membawa AI yang mudah dipakai dan relevan untuk UMKM sampai 
                  perusahaan, agar Anda berada di sisi yang menang.
                </p>
                
                <p className="font-semibold text-foreground">
                  &ldquo;AI bisa jadi ancaman, tetapi juga peluang besar. MarkasAI memastikan
                  bisnis berada di sisi yang benar: memakai AI untuk tumbuh, bukan tergeser.&rdquo;
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href="/about">
                    Pelajari Mengapa
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 btn-force-text-hover">
                  <Link href="/products">
                    Lihat Solusi AI
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
