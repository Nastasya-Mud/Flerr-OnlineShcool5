import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { galleryAPI } from '@/lib/api';
import { FALLBACK_IMAGE_DATA_URI, getOptimizedImageUrl } from '@/lib/image';

const CATEGORIES = [
  { value: '', label: 'Все работы' },
  { value: 'букеты', label: 'Букеты' },
  { value: 'свадьбы', label: 'Свадебные' },
  { value: 'композиции', label: 'Композиции' },
  { value: 'сезонные', label: 'Сезонные' },
  { value: 'корпоративные', label: 'Корпоративные' },
];

export function GalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const params = selectedCategory ? { category: selectedCategory } : {};
      const response = await galleryAPI.getAll(params);
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#333A1A] mb-4">
            Работы учеников
          </h1>
          <p className="text-lg text-[#9C7750] max-w-2xl mx-auto">
            Вдохновляйтесь работами наших студентов и преподавателей
          </p>
        </motion.div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.value)}
              className={selectedCategory === cat.value ? 'bg-[#A50C0A]' : ''}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-[#9C7750]">Работ в этой категории пока нет</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge className="mb-2 bg-[#A50C0A]">{item.category}</Badge>
                    <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-white/90 text-sm line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

