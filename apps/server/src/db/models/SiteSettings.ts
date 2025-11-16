import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  heroImage1: string;
  heroImage2?: string;
  updatedAt: Date;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    heroImage1: {
      type: String,
      required: true,
      default: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80&auto=format&fit=crop',
    },
    heroImage2: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Гарантируем, что будет только один документ настроек
siteSettingsSchema.index({ _id: 1 }, { unique: true });

export const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema);

