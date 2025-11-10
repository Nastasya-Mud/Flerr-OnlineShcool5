import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LEVELS } from '@/lib/constants';
import type { Course } from '@/lib/hooks/useCourses';

interface CourseCardProps {
  course: Course;
  delay?: number;
}

export function CourseCard({ course, delay = 0 }: CourseCardProps) {
  const FALLBACK_IMAGE = useMemo(
    () =>
      `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#F4E7D3"/><stop offset="100%" stop-color="#E5D4B0"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)" rx="24"/><g fill="#A50C0A" font-family="'Segoe UI',sans-serif" text-anchor="middle"><text x="50%" y="52%" font-size="44" font-weight="700">Flerr Course</text><text x="50%" y="68%" font-size="20" fill="#9C7750">Изображение недоступно</text></g></svg>`
      )}`,
    []
  );

  const [imageSrc, setImageSrc] = useState(course.coverUrl || FALLBACK_IMAGE);

  useEffect(() => {
    setImageSrc(course.coverUrl || FALLBACK_IMAGE);
  }, [course.coverUrl]);

  const handleImageError = () => {
    if (imageSrc !== FALLBACK_IMAGE) {
      console.warn('⛔ Ошибка загрузки обложки курса, используется изображение по умолчанию', {
        courseId: course._id,
        original: course.coverUrl,
      });
      setImageSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Link to={`/courses/${course.slug}`}>
        <Card className="group hover:scale-[1.02] transition-transform duration-300 cursor-pointer overflow-hidden">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={imageSrc}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-[#f5f1eb]"
              loading="lazy"
              onError={handleImageError}
            />
            <div className="absolute top-3 right-3">
              <Badge variant="default">{LEVELS[course.level]}</Badge>
            </div>
            {course.rating && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Star className="w-4 h-4 fill-[#A50C0A] text-[#A50C0A]" />
                <span className="text-sm font-semibold text-[#333A1A]">{course.rating}</span>
              </div>
            )}
          </div>

          <CardContent className="p-5">
            <h3 className="text-xl font-semibold text-[#333A1A] mb-2 group-hover:text-[#A50C0A] transition-colors line-clamp-2">
              {course.title}
            </h3>
            
            {course.shortDescription && (
              <p className="text-sm text-[#9C7750] mb-4 line-clamp-2">
                {course.shortDescription}
              </p>
            )}

            {course.instructor && (
              <p className="text-sm text-[#9C7750] mb-3">
                Преподаватель: <span className="font-medium">{course.instructor}</span>
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {course.categories.map((category) => (
                <Badge key={category} variant="muted" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-[#9C7750]">
              <div className="flex items-center gap-4">
                {course.duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{Math.round(course.duration / 60)} мин</span>
                  </div>
                )}
                {course.lessons && Array.isArray(course.lessons) && course.lessons.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons.length} уроков</span>
                  </div>
                )}
              </div>
              {course.studentsCount && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{course.studentsCount}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

