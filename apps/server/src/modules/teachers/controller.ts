import { Request, Response } from 'express';
import { Teacher } from '../../db/models/index.js';

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const { active } = req.query;
    const filter: any = {};
    
    if (active !== undefined) {
      filter.active = active === 'true';
    }

    const teachers = await Teacher.find(filter)
      .populate('courses', 'title slug')
      .sort({ order: 1, createdAt: -1 });

    res.json({ teachers });
  } catch (error: any) {
    console.error('Get teachers error:', error);
    res.status(500).json({ error: 'Ошибка при получении преподавателей' });
  }
};

export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('courses', 'title slug coverUrl');
    
    if (!teacher) {
      return res.status(404).json({ error: 'Преподаватель не найден' });
    }

    res.json({ teacher });
  } catch (error: any) {
    console.error('Get teacher error:', error);
    res.status(500).json({ error: 'Ошибка при получении преподавателя' });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json({ teacher });
  } catch (error: any) {
    console.error('Create teacher error:', error);
    res.status(500).json({ error: 'Ошибка при создании преподавателя' });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!teacher) {
      return res.status(404).json({ error: 'Преподаватель не найден' });
    }

    res.json({ teacher });
  } catch (error: any) {
    console.error('Update teacher error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении преподавателя' });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({ error: 'Преподаватель не найден' });
    }

    res.json({ message: 'Преподаватель удален' });
  } catch (error: any) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ error: 'Ошибка при удалении преподавателя' });
  }
};

