import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Play, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PromoCodeForm } from '@/components/domain/PromoCodeForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourse } from '@/lib/hooks/useCourses';
import { LEVELS } from '@/lib/constants';
import { formatDuration } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';

export function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const { course, loading, refetch } = useCourse(slug!);
  const { isAuthenticated } = useAuthStore();
  const [promoModalOpen, setPromoModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl text-[#9C7750]">Курс не найден</h2>
      </div>
    );
  }

  const completedLessons = course.lessons?.filter(
    (lesson: any) => course.progress?.[lesson._id] === 100
  ).length || 0;
  const totalLessons = course.lessons?.length || 0;
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${course.coverUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>

        <div className="relative h-full container mx-auto px-4 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl text-white"
          >
            <Badge variant="secondary" className="mb-4">
              {LEVELS[course.level]}
            </Badge>
            <h1 className="text-5xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl mb-6 opacity-90">{course.shortDescription}</p>

            {course.instructor && (
              <p className="text-lg mb-6">
                Преподаватель: <span className="font-semibold">{course.instructor}</span>
              </p>
            )}

            <div className="flex flex-wrap gap-6 text-sm">
              {course.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{Math.round(course.duration / 60)} минут</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{totalLessons} уроков</span>
              </div>
              {course.studentsCount && (
                <div className="flex items-center gap-2">
                  <span>{course.studentsCount} студентов</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-[#333A1A] mb-4">О курсе</h2>
              <p className="text-[#9C7750] whitespace-pre-line leading-relaxed">
                {course.description}
              </p>
            </section>

            {/* Lessons */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-[#333A1A] mb-6">Программа курса</h2>
              
              {isAuthenticated && totalLessons > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-[#9C7750] mb-2">
                    <span>Прогресс</span>
                    <span>{completedLessons} из {totalLessons} уроков</span>
                  </div>
                  <Progress value={progressPercent} />
                </div>
              )}

              <div className="space-y-3">
                {course.lessons?.map((lesson: any, index: number) => {
                  const isCompleted = course.progress?.[lesson._id] === 100;
                  const canAccess = course.hasAccess || lesson.freePreview;

                  return (
                    <div
                      key={lesson._id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors ${
                        canAccess
                          ? 'border-[#E5CD9F] hover:border-[#A50C0A] hover:bg-[#F8EAC8]/50 cursor-pointer'
                          : 'border-[#E5CD9F]/50 bg-[#F8EAC8]/30'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? 'bg-[#333A1A] text-white'
                            : canAccess
                            ? 'bg-[#A50C0A] text-white'
                            : 'bg-[#E5CD9F] text-[#9C7750]'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : canAccess ? (
                          <Play className="w-5 h-5" />
                        ) : (
                          <Lock className="w-5 h-5" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[#333A1A]">
                            {index + 1}. {lesson.title}
                          </h3>
                          {lesson.freePreview && <Badge variant="success">Бесплатно</Badge>}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-[#9C7750]">
                          <span>{formatDuration(lesson.durationSec)}</span>
                          {lesson.materials?.length > 0 && (
                            <span>{lesson.materials.length} материалов</span>
                          )}
                        </div>
                      </div>

                      {canAccess && isAuthenticated ? (
                        <Link to={`/lessons/${lesson._id}`}>
                          <Button size="sm">Смотреть</Button>
                        </Link>
                      ) : !isAuthenticated ? (
                        <Link to="/login">
                          <Button size="sm" variant="outline">
                            Войти
                          </Button>
                        </Link>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          Закрыто
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Access Card */}
            {isAuthenticated && !course.hasAccess && (
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
                <h3 className="text-xl font-semibold text-[#333A1A] mb-4">Доступ к курсу</h3>
                <p className="text-sm text-[#9C7750] mb-4">
                  Активируйте промокод, чтобы получить полный доступ ко всем урокам курса
                </p>
                <Button className="w-full" onClick={() => setPromoModalOpen(true)}>
                  Активировать промокод
                </Button>
              </div>
            )}

            {/* Categories */}
            {course.categories.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-[#333A1A] mb-3">Категории</h3>
                <div className="flex flex-wrap gap-2">
                  {course.categories.map((category: string) => (
                    <Badge key={category} variant="muted">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Promo Code Modal */}
      <Dialog open={promoModalOpen} onOpenChange={setPromoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Активация промокода</DialogTitle>
          </DialogHeader>
          <PromoCodeForm
            onSuccess={() => {
              setPromoModalOpen(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

