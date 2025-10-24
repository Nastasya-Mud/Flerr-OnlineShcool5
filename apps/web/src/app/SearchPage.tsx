import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/domain/CourseCard';
import { searchAPI } from '@/lib/api';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await searchAPI.search({ q: query });
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#333A1A] mb-8 text-center">Поиск курсов и уроков</h1>

        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9C7750]" />
              <Input
                type="text"
                placeholder="Введите запрос..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? 'Поиск...' : 'Найти'}
            </Button>
          </div>
        </form>

        {results && (
          <div className="space-y-8">
            {/* Courses */}
            {results.results.courses.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-[#333A1A] mb-6">
                  Курсы ({results.results.courses.length})
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {results.results.courses.map((course: any) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>
              </section>
            )}

            {/* Lessons */}
            {results.results.lessons.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-[#333A1A] mb-6">
                  Уроки ({results.results.lessons.length})
                </h2>
                <div className="space-y-4">
                  {results.results.lessons.map((lesson: any) => (
                    <div
                      key={lesson._id}
                      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                    >
                      <h3 className="text-xl font-semibold text-[#333A1A] mb-2">{lesson.title}</h3>
                      {lesson.description && (
                        <p className="text-[#9C7750] mb-3">{lesson.description}</p>
                      )}
                      <p className="text-sm text-[#9C7750]">
                        Курс: {lesson.courseId?.title}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {results.results.courses.length === 0 && results.results.lessons.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-[#9C7750]">Ничего не найдено</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

