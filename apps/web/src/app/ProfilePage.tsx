import { BookOpen, Heart, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store';

export function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#A50C0A] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle>{user.name}</CardTitle>
                    <p className="text-sm text-[#9C7750]">{user.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <Badge key={role} variant={role === 'admin' ? 'default' : 'secondary'}>
                      {role === 'admin' ? 'Администратор' : 'Студент'}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Достижения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#9C7750]">Курсов начато</span>
                    <span className="font-semibold text-[#333A1A]">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#9C7750]">Уроков завершено</span>
                    <span className="font-semibold text-[#333A1A]">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#9C7750]">Часов обучения</span>
                    <span className="font-semibold text-[#333A1A]">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Мои курсы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-[#9C7750]">
                  <p>У вас пока нет активных курсов</p>
                  <p className="text-sm mt-2">Активируйте промокод для доступа к курсам</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Избранное
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-[#9C7750]">
                  <p>Вы пока не добавили курсы в избранное</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

