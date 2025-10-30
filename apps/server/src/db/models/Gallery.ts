import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  imageUrl: string;
  category: string;
  description?: string;
  order: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['букеты', 'свадьбы', 'композиции', 'сезонные', 'корпоративные', 'другое'],
    },
    description: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

gallerySchema.index({ category: 1 });
gallerySchema.index({ featured: 1, order: 1 });
gallerySchema.index({ order: 1 });

export const Gallery = mongoose.model<IGallery>('Gallery', gallerySchema);

