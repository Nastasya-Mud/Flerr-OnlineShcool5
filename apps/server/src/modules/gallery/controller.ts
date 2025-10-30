import { Request, Response } from 'express';
import { Gallery } from '../../db/models/index.js';

export const getGalleryItems = async (req: Request, res: Response) => {
  try {
    const { category, featured, limit } = req.query;
    const filter: any = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    let query = Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    
    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const items = await query;

    res.json({ items });
  } catch (error: any) {
    console.error('Get gallery error:', error);
    res.status(500).json({ error: 'Ошибка при получении галереи' });
  }
};

export const getGalleryItemById = async (req: Request, res: Response) => {
  try {
    const item = await Gallery.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }

    res.json({ item });
  } catch (error: any) {
    console.error('Get gallery item error:', error);
    res.status(500).json({ error: 'Ошибка при получении элемента' });
  }
};

export const createGalleryItem = async (req: Request, res: Response) => {
  try {
    const item = await Gallery.create(req.body);
    res.status(201).json({ item });
  } catch (error: any) {
    console.error('Create gallery item error:', error);
    res.status(500).json({ error: 'Ошибка при создании элемента' });
  }
};

export const updateGalleryItem = async (req: Request, res: Response) => {
  try {
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }

    res.json({ item });
  } catch (error: any) {
    console.error('Update gallery item error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении элемента' });
  }
};

export const deleteGalleryItem = async (req: Request, res: Response) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }

    res.json({ message: 'Элемент удален' });
  } catch (error: any) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({ error: 'Ошибка при удалении элемента' });
  }
};

