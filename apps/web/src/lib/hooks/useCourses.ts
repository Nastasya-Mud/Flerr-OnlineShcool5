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

  // Мемоизируем ключ зависимостей для избежания лишних запросов
  const paramsKey = useMemo(() => JSON.stringify(params || {}), [JSON.stringify(params || {})]);

  useEffect(() => {
    let cancelled = false;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching courses with params:', params);
        const response = await coursesAPI.getAll(params);
        console.log('Courses API response:', response.data);
        
        // Проверяем, что данные пришли корректно
        if (cancelled) return;
        
        if (response.data) {
          const coursesData = response.data.courses || [];
          const paginationData = response.data.pagination || null;
          
          console.log(`Loaded ${coursesData.length} courses`);
          
          setCourses(coursesData);
          setPagination(paginationData);
        } else {
          console.warn('No data in response');
          setCourses([]);
          setPagination(null);
        }
      } catch (err: any) {
        if (cancelled) return;
        
        console.error('Error fetching courses:', err);
        console.error('Error details:', err.response?.data);
        
        const errorMessage = err.response?.data?.error || err.message || 'Ошибка загрузки курсов';
        setError(errorMessage);
        setCourses([]);
        setPagination(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCourses();
    
    return () => {
      cancelled = true;
    };
  }, [paramsKey]);

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

