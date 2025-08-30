'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';

const leadFormSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
  source: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  title?: string;
  description?: string;
  source?: string;
}

export function LeadForm({ 
  title = "Hubungi Kami",
  description = "Isi form di bawah ini dan tim kami akan menghubungi Anda dalam 24 jam",
  source = "contact-page"
}: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      source,
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        reset();
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // In a real app, you'd show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Pesan Terkirim!</h3>
            <p className="text-muted-foreground">
              Terima kasih telah menghubungi kami. Tim kami akan segera menghubungi Anda dalam 24 jam.
            </p>
          </div>
          <Button 
            onClick={() => setIsSubmitted(false)}
            variant="outline"
          >
            Kirim Pesan Lain
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Masukkan nama lengkap Anda"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="nama@perusahaan.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor WhatsApp</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="08123456789"
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">Nama Perusahaan</Label>
            <Input
              id="company"
              {...register('company')}
              placeholder="PT. Contoh Perusahaan"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Pesan *</Label>
            <textarea
              id="message"
              {...register('message')}
              placeholder="Ceritakan kebutuhan AI untuk bisnis Anda..."
              rows={4}
              className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.message ? 'border-red-500' : ''
              }`}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full btn-gradient-shopee-tiktok hover-lift"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              'Kirim Pesan'
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Dengan mengirim form ini, Anda menyetujui bahwa kami dapat menghubungi Anda 
            untuk memberikan informasi tentang produk dan layanan kami.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
