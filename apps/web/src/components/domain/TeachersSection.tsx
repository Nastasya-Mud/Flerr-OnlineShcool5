import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { teachersAPI } from '@/lib/api';

export function TeachersSection() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await teachersAPI.getAll({ active: true });
        setTeachers(response.data.teachers || []);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-[#F8EAC8]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (teachers.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[#F8EAC8]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#333A1A] mb-4">
            Наши преподаватели
          </h2>
          <p className="text-lg text-[#9C7750] max-w-2xl mx-auto">
            Опытные флористы с международными сертификатами делятся знаниями
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher, index) => (
            <motion.div
              key={teacher._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={teacher.photo}
                    alt={teacher.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-[#333A1A] mb-2">
                    {teacher.name}
                  </h3>
                  <p className="text-[#A50C0A] font-medium mb-3">
                    {teacher.specialization}
                  </p>
                  <p className="text-[#9C7750] text-sm mb-3">
                    {teacher.experience}
                  </p>
                  <p className="text-[#333A1A] line-clamp-3">
                    {teacher.bio}
                  </p>
                  {teacher.social && (
                    <div className="flex gap-3 mt-4">
                      {teacher.social.instagram && (
                        <a
                          href={teacher.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#A50C0A] hover:text-[#333A1A] transition-colors"
                        >
                          📸
                        </a>
                      )}
                      {teacher.social.website && (
                        <a
                          href={teacher.social.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#A50C0A] hover:text-[#333A1A] transition-colors"
                        >
                          🌐
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

