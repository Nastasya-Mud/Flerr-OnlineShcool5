import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/domain/CourseCard';
import { TeachersSection } from '@/components/domain/TeachersSection';
import { GallerySection } from '@/components/domain/GallerySection';
import { useCourses } from '@/lib/hooks/useCourses';
import { Skeleton } from '@/components/ui/skeleton';
import { getOptimizedImageUrl } from '@/lib/image';
import { siteSettingsAPI } from '@/lib/api';

export function HomePage() {
  const { courses, loading } = useCourses({ limit: 6, published: true });
  const [heroImage1, setHeroImage1] = useState<string>('');
  const [heroImage2, setHeroImage2] = useState<string>('');
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await siteSettingsAPI.get();
        const settings = response.data.settings;
        if (settings.heroImage1) {
          setHeroImage1(getOptimizedImageUrl(settings.heroImage1));
        }
        if (settings.heroImage2) {
          setHeroImage2(getOptimizedImageUrl(settings.heroImage2));
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
        // Fallback to default image
        setHeroImage1(getOptimizedImageUrl('https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80&auto=format&fit=crop'));
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-[minmax(0,1fr)_520px] gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#333A1A] mb-6">
                Искусство флористики
              </h1>
              <p className="text-xl text-[#9C7750] mb-8 leading-relaxed">
                Откройте для себя мир цветов с нашей онлайн-школой. Обучайтесь у лучших мастеров,
                создавайте уникальные композиции и превращайте хобби в профессию.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/courses">
                    Смотреть курсы
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/register">Начать обучение</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative flex justify-center md:justify-end gap-4 flex-wrap"
            >
              {loadingSettings ? (
                <Skeleton className="w-[400px] md:w-[500px] lg:w-[600px] aspect-[3/4] rounded-[36px]" />
              ) : (
                <>
                  {heroImage1 && (
                    <motion.div
                      whileHover={{ scale: 1.05, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="w-[400px] md:w-[500px] lg:w-[600px] aspect-[3/4] rounded-[36px] overflow-hidden shadow-[0_25px_50px_rgba(165,12,10,0.25)] bg-[#f5f1eb]"
                    >
                      <img
                        src={heroImage1}
                        alt="Флористика"
                        className="w-full h-full object-cover object-center"
                        loading="eager"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getOptimizedImageUrl('https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80&auto=format&fit=crop');
                        }}
                      />
                    </motion.div>
                  )}
                  {heroImage2 && (
                    <motion.div
                      whileHover={{ scale: 1.05, y: -10 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="w-[400px] md:w-[500px] lg:w-[600px] aspect-[3/4] rounded-[36px] overflow-hidden shadow-[0_25px_50px_rgba(165,12,10,0.25)] bg-[#f5f1eb]"
                    >
                      <img
                        src={heroImage2}
                        alt="Флористика"
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getOptimizedImageUrl('https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80&auto=format&fit=crop');
                        }}
                      />
                    </motion.div>
                  )}
                </>
              )}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#A50C0A] rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#333A1A]">500+</div>
                    <div className="text-sm text-[#9C7750]">Студентов</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#333A1A] mb-4">Отзывы учеников</h2>
            <p className="text-lg text-[#9C7750]">Что говорят наши студенты о курсах</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Анна Ковалева',
                text: 'Прошла курс "Основы флористики" и осталась в полном восторге! Мария Петрова — потрясающий преподаватель, объясняет все доступно и подробно. Теперь создаю букеты для друзей!',
                rating: 5,
              },
              {
                name: 'Елена Смирнова',
                text: 'Курс по свадебной флористике превзошел все ожидания! Научилась создавать профессиональные композиции. Уже получила первые заказы на свадьбы. Спасибо!',
                rating: 5,
              },
              {
                name: 'Ольга Новикова',
                text: 'Отличная школа! Видеоуроки очень качественные, все понятно показано. Особенно понравился раздел с сезонными композициями. Рекомендую всем!',
                rating: 5,
              },
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-[#FFB800] text-xl">★</span>
                  ))}
                </div>
                <p className="text-[#333A1A] mb-4 italic">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#A50C0A]/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#A50C0A]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#333A1A]">{review.name}</p>
                    <p className="text-sm text-[#9C7750]">Студентка Flerr</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-[#333A1A] mb-2">Популярные курсы</h2>
              <p className="text-[#9C7750]">Выберите курс и начните обучение уже сегодня</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/courses">Все курсы</Link>
            </Button>
          </div>

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
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <CourseCard key={course._id} course={course} delay={index * 0.1} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Teachers Section */}
      <TeachersSection />

      {/* Gallery Section */}
      <GallerySection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#A50C0A] to-[#9C7750] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Начните учиться прямо сейчас</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Активируйте промокод и получите доступ к эксклюзивным курсам флористики
            </p>
            <Button size="lg" variant="secondary" asChild className="bg-white text-[#A50C0A] hover:bg-white/90">
              <Link to="/register">Зарегистрироваться</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

