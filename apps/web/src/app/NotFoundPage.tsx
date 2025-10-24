import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#A50C0A] mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-[#333A1A] mb-4">Страница не найдена</h2>
        <p className="text-lg text-[#9C7750] mb-8">
          К сожалению, запрашиваемая страница не существует
        </p>
        <Button asChild size="lg">
          <Link to="/">
            <Home className="w-5 h-5 mr-2" />
            На главную
          </Link>
        </Button>
      </div>
    </div>
  );
}

