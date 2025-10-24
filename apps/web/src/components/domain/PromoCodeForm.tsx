import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { promoAPI } from '@/lib/api';
import { useToast } from '@/lib/hooks/useToast';

interface PromoCodeFormProps {
  onSuccess?: () => void;
}

export function PromoCodeForm({ onSuccess }: PromoCodeFormProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setStatus('error');
      setMessage('Введите промокод');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await promoAPI.activate(code.trim().toUpperCase());
      
      setStatus('success');
      setMessage(response.data.message || 'Промокод успешно активирован!');
      
      toast({
        title: 'Успешно!',
        description: response.data.message,
        variant: 'success',
      });

      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (error: any) {
      setStatus('error');
      const errorMessage = error.response?.data?.error || 'Ошибка активации промокода';
      setMessage(errorMessage);
      
      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="promo-code">Промокод</Label>
        <div className="relative">
          <Input
            id="promo-code"
            type="text"
            placeholder="Введите промокод"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            disabled={loading || status === 'success'}
            className="uppercase"
          />
          {status === 'success' && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#333A1A]" />
          )}
          {status === 'error' && (
            <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A50C0A]" />
          )}
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            status === 'success'
              ? 'bg-[#333A1A]/10 text-[#333A1A] border border-[#333A1A]/20'
              : 'bg-[#A50C0A]/10 text-[#A50C0A] border border-[#A50C0A]/20'
          }`}
        >
          {message}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || status === 'success' || !code.trim()}
        className="w-full"
      >
        {loading ? 'Активация...' : status === 'success' ? 'Активирован' : 'Активировать'}
      </Button>

      <p className="text-xs text-[#9C7750] text-center">
        Промокод открывает доступ к урокам курса или всей платформе
      </p>
    </form>
  );
}

