import { useState, useMemo, useCallback, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { CourseCard } from '@/components/domain/CourseCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourses } from '@/lib/hooks/useCourses';
import { LEVELS, CATEGORIES, SORT_OPTIONS } from '@/lib/constants';

export function CoursesPage() {
  const [filters, setFilters] = useState({
    level: '',
    category: '',
    sort: '-createdAt',
  });

  // Мемоизируем параметры запроса
  const queryParams = useMemo(() => ({ ...filters, published: true }), [filters.level, filters.category, filters.sort]);
  const { courses, loading, error, pagination } = useCourses(queryParams);

  // Debug logging
  useEffect(() => {
    console.log('🎨 CoursesPage render:', { 
      courses: courses?.length || 0, 
      loading, 
      error,
      coursesArray: courses,
      pagination 
    });
  }, [courses, loading, error, pagination]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ level: '', category: '', sort: '-createdAt' });
  }, []);

  const hasActiveFilters = useMemo(() => filters.level || filters.category, [filters.level, filters.category]);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#333A1A] mb-3">Каталог курсов</h1>
          <p className="text-lg text-[#9C7750]">
            Найдите идеальный курс для вашего уровня и интересов
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-[#9C7750]" />
            <h3 className="text-lg font-semibold text-[#333A1A]">Фильтры</h3>
            {hasActiveFilters && (
              <Button variant="link" size="sm" onClick={clearFilters}>
                Сбросить
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-[#333A1A] mb-2 block">Уровень</label>
              <Select value={filters.level || 'all'} onValueChange={(value) => handleFilterChange('level', value === 'all' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Все уровни" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все уровни</SelectItem>
                  {Object.entries(LEVELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#333A1A] mb-2 block">Категория</label>
              <Select value={filters.category || 'all'} onValueChange={(value) => handleFilterChange('category', value === 'all' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#333A1A] mb-2 block">Сортировка</label>
              <Select value={filters.sort} onValueChange={(value) => handleFilterChange('sort', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {filters.level && (
                <Badge variant="outline" className="cursor-pointer" onClick={() => handleFilterChange('level', '')}>
                  {LEVELS[filters.level as keyof typeof LEVELS]} ✕
                </Badge>
              )}
              {filters.category && (
                <Badge variant="outline" className="cursor-pointer" onClick={() => handleFilterChange('category', '')}>
                  {CATEGORIES.find((c) => c.value === filters.category)?.label} ✕
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-[#9C7750]">
            {loading ? (
              'Загрузка...'
            ) : error ? (
              `Ошибка: ${error}`
            ) : (
              `Найдено курсов: ${pagination?.total ?? courses?.length ?? 0}`
            )}
          </p>
          {/* Debug info - можно удалить после исправления */}
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-gray-400 mt-1">
              Debug: loading={String(loading)}, error={String(error)}, courses={courses?.length ?? 0}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <p className="text-sm text-red-600 mt-2">
              Проверьте консоль браузера (F12) для подробностей
            </p>
          </div>
        )}

        {/* Courses Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/5] w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Обновить страницу</Button>
          </div>
        ) : Array.isArray(courses) && courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => {
              if (!course || !course._id) {
                console.warn('⚠️ Invalid course at index', index, course);
                return null;
              }
              return (
                <CourseCard key={course._id} course={course} delay={index * 0.05} />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-[#9C7750] mb-4">Курсы не найдены</p>
            <p className="text-sm text-[#9C7750] mb-4">
              {loading ? 'Загрузка...' : 'Попробуйте изменить фильтры или обновить страницу'}
            </p>
            <Button onClick={clearFilters}>Сбросить фильтры</Button>
          </div>
        )}
      </div>
    </div>
  );
}

