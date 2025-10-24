import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  categories: string[];
  coverUrl: string;
  price?: number;
  published: boolean;
  lessons: mongoose.Types.ObjectId[];
  instructor?: string;
  duration?: number; // в минутах
  studentsCount?: number;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
      index: true,
    },
    categories: {
      type: [String],
      default: [],
      index: true,
    },
    coverUrl: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    instructor: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    studentsCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Индекс для поиска
courseSchema.index({ title: 'text', description: 'text' });

export const Course = mongoose.model<ICourse>('Course', courseSchema);

