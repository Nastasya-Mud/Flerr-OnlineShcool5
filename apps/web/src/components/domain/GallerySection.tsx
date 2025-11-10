import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { galleryAPI } from '@/lib/api';
import { FALLBACK_IMAGE_DATA_URI, getOptimizedImageUrl } from '@/lib/image';

export function GallerySection() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await galleryAPI.getAll({ featured: true, limit: 6 });
        setItems(response.data.items || []);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#333A1A] mb-4">
            Галерея наших работ
          </h2>
          <p className="text-lg text-[#9C7750] max-w-2xl mx-auto">
            Вдохновляйтесь работами наших студентов и преподавателей
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={failedImages[item._id] ? FALLBACK_IMAGE_DATA_URI : getOptimizedImageUrl(item.imageUrl)}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={() =>
                  setFailedImages((prev) => ({
                    ...prev,
                    [item._id]: true,
                  }))
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Badge className="mb-2">{item.category}</Badge>
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                  {item.description && (
                    <p className="text-white/80 text-sm mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

