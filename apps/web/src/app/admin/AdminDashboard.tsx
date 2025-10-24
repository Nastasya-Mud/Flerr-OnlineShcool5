import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Ticket, Users, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { adminAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

function AdminHome() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#333A1A] mb-2">Панель управления</h2>
        <p className="text-[#9C7750]">Обзор статистики платформы</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Пользователей</CardDescription>
            <CardTitle className="text-3xl">{stats?.stats.totalUsers || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Курсов</CardDescription>
            <CardTitle className="text-3xl">{stats?.stats.totalCourses || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Уроков</CardDescription>
            <CardTitle className="text-3xl">{stats?.stats.totalLessons || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Активаций</CardDescription>
            <CardTitle className="text-3xl">{stats?.stats.totalActivations || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Activations */}
      <Card>
        <CardHeader>
          <CardTitle>Последние активации промокодов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.recentActivations?.length > 0 ? (
              stats.recentActivations.map((activation: any) => (
                <div
                  key={activation._id}
                  className="flex items-center justify-between p-3 bg-[#F8EAC8] rounded-lg"
                >
                  <div>
                    <p className="font-medium text-[#333A1A]">{activation.userId?.name}</p>
                    <p className="text-sm text-[#9C7750]">{activation.userId?.email}</p>
                  </div>
                  <Badge variant={activation.promoCodeId?.scope === 'platform' ? 'default' : 'secondary'}>
                    {activation.promoCodeId?.code}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-[#9C7750] py-4">Нет активаций</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Courses */}
      {stats?.topCourses && stats.topCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Популярные курсы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCourses.map((course: any, index: number) => (
                <div
                  key={course._id}
                  className="flex items-center gap-4 p-3 bg-[#F8EAC8] rounded-lg"
                >
                  <div className="w-10 h-10 bg-[#A50C0A] rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#333A1A]">{course.title}</p>
                    <p className="text-sm text-[#9C7750]">{course.studentsCount} студентов</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AdminCourses() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-[#333A1A] mb-6">Управление курсами</h2>
      <Card>
        <CardContent className="p-12 text-center text-[#9C7750]">
          <p>Здесь будет CRUD интерфейс для управления курсами</p>
          <p className="text-sm mt-2">Создание, редактирование и удаление курсов</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminPromoCodes() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-[#333A1A] mb-6">Промокоды</h2>
      <Card>
        <CardContent className="p-12 text-center text-[#9C7750]">
          <p>Здесь будет CRUD интерфейс для управления промокодами</p>
          <p className="text-sm mt-2">Создание, редактирование и деактивация промокодов</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminUsers() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-[#333A1A] mb-6">Пользователи</h2>
      <Card>
        <CardContent className="p-12 text-center text-[#9C7750]">
          <p>Здесь будет список пользователей с возможностью управления</p>
          <p className="text-sm mt-2">Просмотр, редактирование ролей и удаление пользователей</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminDashboard() {
  const location = useLocation();

  const navItems = [
    { href: '/admin', label: 'Панель', icon: LayoutDashboard },
    { href: '/admin/courses', label: 'Курсы', icon: BookOpen },
    { href: '/admin/promo', label: 'Промокоды', icon: Ticket },
    { href: '/admin/users', label: 'Пользователи', icon: Users },
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Админка
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link key={item.href} to={item.href}>
                        <Button
                          variant={isActive ? 'default' : 'ghost'}
                          className={cn('w-full justify-start', isActive && 'bg-[#A50C0A]')}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Routes>
              <Route path="/" element={<AdminHome />} />
              <Route path="/courses" element={<AdminCourses />} />
              <Route path="/promo" element={<AdminPromoCodes />} />
              <Route path="/users" element={<AdminUsers />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

