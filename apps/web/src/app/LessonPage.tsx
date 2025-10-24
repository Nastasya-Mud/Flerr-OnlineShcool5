import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/domain/VideoPlayer';
import { Skeleton } from '@/components/ui/skeleton';
import { lessonsAPI } from '@/lib/api';
import { useToast } from '@/lib/hooks/useToast';

export function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const response = await lessonsAPI.getById(id!);
        setLesson(response.data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Ошибка загрузки урока';
        setError(errorMessage);
        
        if (err.response?.status === 403) {
          toast({
            title: 'Нет доступа',
            description: err.response.data.message || errorMessage,
            variant: 'destructive',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLesson();
    }
  }, [id, toast]);

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="aspect-video w-full mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl text-[#A50C0A] mb-4">{error || 'Урок не найден'}</h2>
        <Button asChild>
          <Link to="/courses">Вернуться к курсам</Link>
        </Button>
      </div>
    );
  }

  const course = lesson.courseId;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to={`/courses/${course.slug}`}
            className="inline-flex items-center gap-2 text-[#9C7750] hover:text-[#A50C0A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к курсу
          </Link>
        </div>

        {/* Video Player */}
        <div className="mb-8">
          <VideoPlayer
            url={lesson.videoUrl}
            lessonId={lesson._id}
            chapters={lesson.chapters}
          />
        </div>

        {/* Lesson Info */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-[#333A1A] mb-4">{lesson.title}</h1>
          
          {lesson.description && (
            <p className="text-lg text-[#9C7750] mb-6 leading-relaxed">{lesson.description}</p>
          )}

          {/* Materials */}
          {lesson.materials && lesson.materials.length > 0 && (
            <div className="border-t border-[#E5CD9F] pt-6">
              <h2 className="text-2xl font-semibold text-[#333A1A] mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Материалы урока
              </h2>
              <div className="space-y-3">
                {lesson.materials.map((material: any, index: number) => (
                  <a
                    key={index}
                    href={material.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-[#F8EAC8] rounded-lg hover:bg-[#E5CD9F] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#A50C0A] rounded-lg flex items-center justify-center">
                        <Download className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-[#333A1A] group-hover:text-[#A50C0A]">
                          {material.title}
                        </p>
                        <p className="text-sm text-[#9C7750]">{material.type.toUpperCase()}</p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-[#9C7750] group-hover:text-[#A50C0A]" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Course Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link to={`/courses/${course.slug}`}>К программе курса</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

