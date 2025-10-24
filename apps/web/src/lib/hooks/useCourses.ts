import { useState, useEffect } from 'react';
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
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await coursesAPI.getAll(params);
        setCourses(response.data.courses);
        setPagination(response.data.pagination);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Ошибка загрузки курсов');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [JSON.stringify(params)]);

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

