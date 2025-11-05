import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, LogOut, Settings, BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/courses', label: 'Курсы' },
    { href: '/gallery', label: 'Работы учеников' },
    { href: '/search', label: 'Поиск' },
  ];

  return (
    <div className="min-h-screen bg-gradient-cream paper-texture">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full glass-effect border-b border-[#E5CD9F]/50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#A50C0A] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#333A1A]">Flerr</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-[#A50C0A]',
                  isActive(link.href) ? 'text-[#A50C0A]' : 'text-[#333A1A]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/search">
                    <Search className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/profile">
                    <User className="w-5 h-5" />
                  </Link>
                </Button>
                {user?.roles.includes('admin') && (
                  <Button variant="secondary" size="sm" asChild>
                    <Link to="/admin">
                      <Settings className="w-4 h-4 mr-2" />
                      Админка
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Вход</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Регистрация</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5CD9F]/50 glass-effect">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'bg-[#A50C0A] text-white'
                      : 'text-[#333A1A] hover:bg-[#E5CD9F]/30'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[#333A1A] hover:bg-[#E5CD9F]/30"
                  >
                    Профиль
                  </Link>
                  {user?.roles.includes('admin') && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-lg text-sm font-medium text-[#333A1A] hover:bg-[#E5CD9F]/30"
                    >
                      Админка
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[#A50C0A] hover:bg-[#A50C0A]/10 text-left"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[#333A1A] hover:bg-[#E5CD9F]/30"
                  >
                    Вход
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-[#A50C0A] text-white"
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem-8rem)]">{children}</main>

      {/* Footer */}
      <footer className="border-t border-[#E5CD9F]/50 glass-effect mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-[#333A1A] mb-3">О Flerr</h3>
              <p className="text-sm text-[#9C7750]">
                Онлайн-школа флористики. Учитесь создавать прекрасные композиции и букеты с
                лучшими мастерами.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#333A1A] mb-3">Навигация</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-[#9C7750] hover:text-[#A50C0A] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#333A1A] mb-3">Контакты</h3>
              <ul className="space-y-2 text-sm text-[#9C7750]">
                <li>Email: info@flerr.ru</li>
                <li>Тел: +7 (999) 123-45-67</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#E5CD9F]/50 text-center text-sm text-[#9C7750]">
            © {new Date().getFullYear()} Flerr. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}

