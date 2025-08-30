import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  description,
  centered = false,
  className
}: SectionTitleProps) {
  return (
    <div className={cn(
      'space-y-4',
      centered && 'text-center',
      className
    )}>
      {subtitle && (
        <p className="text-sm font-medium text-primary uppercase tracking-wider">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        <span className="text-gradient-markasai">
          {title}
        </span>
      </h2>
      {description && (
        <p className={cn(
          "text-lg text-muted-foreground max-w-3xl",
          centered && "mx-auto"
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
