import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Ticket, Users, Settings, GraduationCap, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/image-upload';
import { adminAPI, coursesAPI, promoAPI, teachersAPI, galleryAPI } from '@/lib/api';
import { LEVELS } from '@/lib/constants';
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

function CourseDialog({ course, onClose, onSave }: { course: any; onClose: () => void; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    slug: course?.slug || '',
    description: course?.description || '',
    shortDescription: course?.shortDescription || '',
    level: course?.level || 'beginner',
    categories: course?.categories?.join(', ') || '',
    coverUrl: course?.coverUrl || '',
    instructor: course?.instructor || '',
    duration: course?.duration || 0,
    published: course?.published || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      categories: formData.categories.split(',').map((c: string) => c.trim()).filter(Boolean),
    };
    onSave(data);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {course ? 'Редактировать курс' : 'Создать новый курс'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Название курса *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">URL (slug) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="osnovyi-floristiki"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="shortDescription">Краткое описание *</Label>
            <Input
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => handleChange('shortDescription', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Полное описание *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full min-h-[100px] px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instructor">Преподаватель *</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => handleChange('instructor', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Длительность (минуты) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level">Уровень сложности *</Label>
              <Select value={formData.level} onValueChange={(value) => handleChange('level', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LEVELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="categories">Категории (через запятую)</Label>
              <Input
                id="categories"
                value={formData.categories}
                onChange={(e) => handleChange('categories', e.target.value)}
                placeholder="букеты, композиции"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="coverUrl">Обложка курса</Label>
            <ImageUpload
              value={formData.coverUrl}
              onChange={(url) => handleChange('coverUrl', url)}
              label="Загрузить обложку"
            />
            <p className="text-xs text-[#9C7750] mt-1">Или вставьте URL:</p>
            <Input
              id="coverUrl"
              value={formData.coverUrl}
              onChange={(e) => handleChange('coverUrl', e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="mt-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => handleChange('published', e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="published">Опубликовать курс</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-[#A50C0A]">
              {course ? 'Сохранить изменения' : 'Создать курс'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll();
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот курс?')) return;

    try {
      await coursesAPI.delete(id);
      setCourses(courses.filter((c) => c._id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Ошибка при удалении курса');
    }
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setShowDialog(true);
  };

  const handleCreate = () => {
    setEditingCourse(null);
    setShowDialog(true);
  };

  const handleSave = async (courseData: any) => {
    try {
      if (editingCourse) {
        await coursesAPI.update(editingCourse._id, courseData);
      } else {
        await coursesAPI.create(courseData);
      }
      setShowDialog(false);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Ошибка при сохранении курса');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#333A1A]">Управление курсами</h2>
        <Button onClick={handleCreate} className="bg-[#A50C0A]">
          + Создать курс
        </Button>
      </div>

      <div className="space-y-4">
        {courses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-[#9C7750]">
              <p>Курсов пока нет. Создайте первый курс!</p>
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => (
            <Card key={course._id}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {course.coverUrl && (
                    <img
                      src={course.coverUrl}
                      alt={course.title}
                      className="w-48 h-32 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-[#333A1A] mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-[#9C7750]">{course.shortDescription}</p>
                      </div>
                      <div className="flex gap-2">
                        {course.published ? (
                          <Badge variant="default">Опубликован</Badge>
                        ) : (
                          <Badge variant="outline">Черновик</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#9C7750] mb-3">
                      <span>👤 {course.instructor}</span>
                      <span>⏱️ {Math.round(course.duration / 60)} мин</span>
                      <span>👥 {course.studentsCount} студентов</span>
                      <span>⭐ {course.rating}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(course)}
                      >
                        ✏️ Редактировать
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(course._id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        🗑️ Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {showDialog && (
        <CourseDialog
          course={editingCourse}
          onClose={() => setShowDialog(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function PromoCodeDialog({ promo, onClose, onSave }: { promo: any; onClose: () => void; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    code: promo?.code || '',
    scope: promo?.scope || 'platform',
    courseId: promo?.courseId || '',
    maxUses: promo?.maxUses || 0,
    validUntil: promo?.validUntil ? new Date(promo.validUntil).toISOString().split('T')[0] : '',
    active: promo?.active !== false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      maxUses: parseInt(String(formData.maxUses)),
      validUntil: formData.validUntil ? new Date(formData.validUntil) : null,
    };
    onSave(data);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{promo ? 'Редактировать промокод' : 'Создать промокод'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="code">Код промокода *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="WELCOME2024"
              required
            />
          </div>

          <div>
            <Label htmlFor="scope">Тип доступа *</Label>
            <Select value={formData.scope} onValueChange={(value) => setFormData({ ...formData, scope: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="platform">Доступ к платформе</SelectItem>
                <SelectItem value="course">Доступ к конкретному курсу</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxUses">Максимум использований</Label>
              <Input
                id="maxUses"
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) })}
                placeholder="0 = без ограничений"
              />
            </div>

            <div>
              <Label htmlFor="validUntil">Действует до</Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="active">Активен</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-[#A50C0A]">
              {promo ? 'Сохранить' : 'Создать'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminPromoCodes() {
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const response = await promoAPI.getAll();
      setPromoCodes(response.data.promoCodes || []);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот промокод?')) return;
    try {
      await promoAPI.delete(id);
      setPromoCodes(promoCodes.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Error deleting promo:', error);
      alert('Ошибка при удалении');
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingPromo) {
        await promoAPI.update(editingPromo._id, data);
      } else {
        await promoAPI.create(data);
      }
      setShowDialog(false);
      fetchPromoCodes();
    } catch (error) {
      console.error('Error saving promo:', error);
      alert('Ошибка при сохранении');
    }
  };

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#333A1A]">Промокоды</h2>
        <Button onClick={() => { setEditingPromo(null); setShowDialog(true); }} className="bg-[#A50C0A]">
          + Создать промокод
        </Button>
      </div>

      <div className="space-y-3">
        {promoCodes.map((promo) => (
          <Card key={promo._id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg font-bold text-[#A50C0A]">{promo.code}</span>
                    {promo.active ? (
                      <Badge variant="default">Активен</Badge>
                    ) : (
                      <Badge variant="outline">Неактивен</Badge>
                    )}
                    <Badge variant="outline">
                      {promo.scope === 'platform' ? '🌐 Платформа' : '📚 Курс'}
                    </Badge>
                  </div>
                  <div className="text-sm text-[#9C7750]">
                    Использований: {promo.usedCount} / {promo.maxUses || '∞'}
                    {promo.validUntil && ` • До: ${new Date(promo.validUntil).toLocaleDateString()}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setEditingPromo(promo); setShowDialog(true); }}
                  >
                    ✏️
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(promo._id)}
                    className="text-red-600"
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showDialog && (
        <PromoCodeDialog
          promo={editingPromo}
          onClose={() => setShowDialog(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId: string, role: string) => {
    try {
      const user = users.find((u) => u._id === userId);
      const hasRole = user.roles.includes(role);
      const newRoles = hasRole
        ? user.roles.filter((r: string) => r !== role)
        : [...user.roles, role];

      await adminAPI.updateUser(userId, { roles: newRoles });
      setUsers(users.map((u) => (u._id === userId ? { ...u, roles: newRoles } : u)));
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Ошибка при обновлении роли');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Удалить этого пользователя?')) return;
    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Ошибка при удалении');
    }
  };

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div>
      <h2 className="text-3xl font-bold text-[#333A1A] mb-6">Пользователи</h2>

      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user._id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#333A1A]">{user.name}</h3>
                  <p className="text-sm text-[#9C7750]">{user.email}</p>
                  <div className="flex gap-2 mt-2">
                    {user.roles.map((role: string) => (
                      <Badge key={role} variant={role === 'admin' ? 'default' : 'outline'}>
                        {role === 'admin' ? '👑 Админ' : '👤 Студент'}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRoleToggle(user._id, 'admin')}
                    className={user.roles.includes('admin') ? 'bg-[#A50C0A] text-white' : ''}
                  >
                    {user.roles.includes('admin') ? '✓ Админ' : '+ Админ'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600"
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TeacherDialog({ teacher, onClose, onSave }: { teacher: any; onClose: () => void; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: teacher?.name || '',
    photo: teacher?.photo || '',
    specialization: teacher?.specialization || '',
    bio: teacher?.bio || '',
    experience: teacher?.experience || '',
    order: teacher?.order || 0,
    active: teacher?.active !== false,
    social: {
      instagram: teacher?.social?.instagram || '',
      website: teacher?.social?.website || '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{teacher ? 'Редактировать преподавателя' : 'Добавить преподавателя'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Имя *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="specialization">Специализация *</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="photo">Фото преподавателя *</Label>
            <ImageUpload
              value={formData.photo}
              onChange={(url) => setFormData({ ...formData, photo: url })}
              label="Загрузить фото"
            />
            <p className="text-xs text-[#9C7750] mt-1">Или вставьте URL:</p>
            <Input
              id="photo"
              value={formData.photo}
              onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="experience">Опыт работы *</Label>
            <Input
              id="experience"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="10+ лет в флористике"
              required
            />
          </div>

          <div>
            <Label htmlFor="bio">Биография *</Label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full min-h-[100px] px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.social.instagram}
                onChange={(e) => setFormData({ ...formData, social: { ...formData.social, instagram: e.target.value } })}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <Label htmlFor="website">Веб-сайт</Label>
              <Input
                id="website"
                value={formData.social.website}
                onChange={(e) => setFormData({ ...formData, social: { ...formData.social, website: e.target.value } })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order">Порядок отображения</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-center gap-2 pt-7">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="active">Активен</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-[#A50C0A]">
              {teacher ? 'Сохранить' : 'Добавить'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await teachersAPI.getAll();
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить преподавателя?')) return;
    try {
      await teachersAPI.delete(id);
      setTeachers(teachers.filter((t) => t._id !== id));
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка при удалении');
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingTeacher) {
        await teachersAPI.update(editingTeacher._id, data);
      } else {
        await teachersAPI.create(data);
      }
      setShowDialog(false);
      fetchTeachers();
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка при сохранении');
    }
  };

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#333A1A]">Преподаватели</h2>
        <Button onClick={() => { setEditingTeacher(null); setShowDialog(true); }} className="bg-[#A50C0A]">
          + Добавить преподавателя
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {teachers.map((teacher) => (
          <Card key={teacher._id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img src={teacher.photo} alt={teacher.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-bold text-[#333A1A]">{teacher.name}</h3>
                      <p className="text-sm text-[#A50C0A]">{teacher.specialization}</p>
                      <p className="text-sm text-[#9C7750]">{teacher.experience}</p>
                    </div>
                    {teacher.active ? (
                      <Badge variant="default">Активен</Badge>
                    ) : (
                      <Badge variant="outline">Скрыт</Badge>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditingTeacher(teacher); setShowDialog(true); }}>
                      ✏️
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(teacher._id)} className="text-red-600">
                      🗑️
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showDialog && <TeacherDialog teacher={editingTeacher} onClose={() => setShowDialog(false)} onSave={handleSave} />}
    </div>
  );
}

function GalleryDialog({ item, onClose, onSave }: { item: any; onClose: () => void; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    imageUrl: item?.imageUrl || '',
    category: item?.category || 'букеты',
    description: item?.description || '',
    order: item?.order || 0,
    featured: item?.featured || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? 'Редактировать' : 'Добавить фото'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Изображение *</Label>
            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              label="Загрузить фото"
            />
            <p className="text-xs text-[#9C7750] mt-1">Или вставьте URL:</p>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Категория *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="букеты">Букеты</SelectItem>
                <SelectItem value="свадьбы">Свадьбы</SelectItem>
                <SelectItem value="композиции">Композиции</SelectItem>
                <SelectItem value="сезонные">Сезонные</SelectItem>
                <SelectItem value="корпоративные">Корпоративные</SelectItem>
                <SelectItem value="другое">Другое</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full min-h-[60px] px-3 py-2 border rounded-md"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order">Порядок</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-center gap-2 pt-7">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="featured">Избранное</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-[#A50C0A]">
              {item ? 'Сохранить' : 'Добавить'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminGallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await galleryAPI.getAll();
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить фото?')) return;
    try {
      await galleryAPI.delete(id);
      setItems(items.filter((i) => i._id !== id));
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка при удалении');
    }
  };

  const handleSave = async (data: any) => {
    try {
      // Sanitize payload to satisfy backend validators
      const sanitized = {
        title: (data.title ?? '').toString().trim(),
        imageUrl: (data.imageUrl ?? '').toString().trim(),
        category: (data.category ?? '').toString().trim(),
        description: (data.description ?? '').toString().trim() || undefined,
        order: Number.isFinite(Number(data.order)) ? Number(data.order) : 0,
        featured: Boolean(data.featured),
      } as const;

      if (editingItem) {
        await galleryAPI.update(editingItem._id, sanitized);
      } else {
        await galleryAPI.create(sanitized);
      }
      setShowDialog(false);
      fetchGallery();
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка при сохранении');
    }
  };

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#333A1A]">Галерея работ</h2>
        <Button onClick={() => { setEditingItem(null); setShowDialog(true); }} className="bg-[#A50C0A]">
          + Добавить фото
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card key={item._id} className="overflow-hidden">
            <div className="aspect-square relative group">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-1">
                {item.featured && <Badge className="bg-[#A50C0A]">⭐</Badge>}
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="outline" className="bg-white" onClick={() => { setEditingItem(item); setShowDialog(true); }}>
                  ✏️
                </Button>
                <Button size="sm" variant="outline" className="bg-white text-red-600" onClick={() => handleDelete(item._id)}>
                  🗑️
                </Button>
              </div>
            </div>
            <CardContent className="p-3">
              <h3 className="font-bold text-sm text-[#333A1A] truncate">{item.title}</h3>
              <Badge variant="outline" className="text-xs mt-1">{item.category}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {showDialog && <GalleryDialog item={editingItem} onClose={() => setShowDialog(false)} onSave={handleSave} />}
    </div>
  );
}

export function AdminDashboard() {
  const location = useLocation();

  const navItems = [
    { href: '/admin', label: 'Панель', icon: LayoutDashboard, path: '' },
    { href: '/admin/courses', label: 'Курсы', icon: BookOpen, path: 'courses' },
    { href: '/admin/teachers', label: 'Преподаватели', icon: GraduationCap, path: 'teachers' },
    { href: '/admin/gallery', label: 'Галерея', icon: ImageIcon, path: 'gallery' },
    { href: '/admin/promo', label: 'Промокоды', icon: Ticket, path: 'promo' },
    { href: '/admin/users', label: 'Пользователи', icon: Users, path: 'users' },
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
                    const isActive = 
                      item.href === '/admin' 
                        ? location.pathname === '/admin'
                        : location.pathname.startsWith(item.href);
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
              <Route index element={<AdminHome />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="teachers" element={<AdminTeachers />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="promo" element={<AdminPromoCodes />} />
              <Route path="users" element={<AdminUsers />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

