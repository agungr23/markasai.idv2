import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 hover-lift group">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden rounded-t-lg bg-white">
          <Image
            src={product.heroImage}
            alt={product.title}
            fill
            className="object-contain transition-transform duration-300 hover:scale-105 p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-white/90 text-primary">
              {product.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold mb-2">{product.title}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {product.shortDesc}
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Fitur Utama:</h4>
          <ul className="space-y-1">
            {product.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                {feature.split(' - ')[0]}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 space-y-3">
        <div className="w-full space-y-2">
          <Button asChild className="w-full btn-gradient-markasai">
            <Link href={`/products/${product.slug}`}>
              Lihat Detail
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-gradient-markasai hover:bg-gradient-to-r hover:from-markasai-gold-50 hover:to-markasai-blue-50 transition-all hover-lift btn-force-text-hover">
            <Link href="/contact">
              Book Demo
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
