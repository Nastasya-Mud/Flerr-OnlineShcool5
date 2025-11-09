import { useState, useEffect, useMemo } from 'react';
import { coursesAPI } from '../api';

export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  categories: string[];
  coverUrl: string;
  price?: number;
  published: boolean;
  instructor?: string;
  duration?: number;
  studentsCount?: number;
  rating?: number;
  lessons?: any[];
  hasAccess?: boolean;
  progress?: Record<string, number>;
}

export const useCourses = (params?: any) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching courses with params:', params);
        const response = await coursesAPI.getAll(params);
        console.log('✅ Courses API response:', response);
        console.log('📦 Response data:', response.data);
        
        // Проверяем, что данные пришли корректно
        if (cancelled) {
          console.log('❌ Request cancelled');
          return;
        }
        
        if (response?.data) {
          const coursesData = Array.isArray(response.data.courses) ? response.data.courses : [];
          const paginationData = response.data.pagination || null;
          
          console.log(`✅ Loaded ${coursesData.length} courses:`, coursesData);
          console.log('📊 Pagination:', paginationData);
          
          if (coursesData.length > 0) {
            setCourses(coursesData);
            setPagination(paginationData);
            console.log('✅ Courses state updated');
          } else {
            console.warn('⚠️ No courses in response data');
            setCourses([]);
            setPagination(null);
          }
        } else {
          console.warn('⚠️ No data in response');
          setCourses([]);
          setPagination(null);
        }
      } catch (err: any) {
        if (cancelled) {
          console.log('❌ Request cancelled (error)');
          return;
        }
        
        console.error('❌ Error fetching courses:', err);
        console.error('❌ Error response:', err.response);
        console.error('❌ Error data:', err.response?.data);
        
        const errorMessage = err.response?.data?.error || err.message || 'Ошибка загрузки курсов';
        setError(errorMessage);
        setCourses([]);
        setPagination(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
          console.log('✅ Loading finished');
        }
      }
    };

    fetchCourses();
    
    return () => {
      cancelled = true;
    };
  }, [params?.level, params?.category, params?.sort, params?.published, params?.search]);

  return { courses, loading, error, pagination };
};

export const useCourse = (slug: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await coursesAPI.getBySlug(slug);
        setCourse(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Ошибка загрузки курса');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  return { course, loading, error, refetch: () => {} };
};

