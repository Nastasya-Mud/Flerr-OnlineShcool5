import mongoose, { Schema, Document } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  scope: 'platform' | 'course';
  courseId?: mongoose.Types.ObjectId;
  maxUses: number;
  usedCount: number;
  expiresAt?: Date;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const promoCodeSchema = new Schema<IPromoCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    scope: {
      type: String,
      enum: ['platform', 'course'],
      required: true,
      default: 'course',
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      index: true,
    },
    maxUses: {
      type: Number,
      required: true,
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Валидация: если scope === 'course', то courseId обязательно
promoCodeSchema.pre('save', function (next) {
  if (this.scope === 'course' && !this.courseId) {
    next(new Error('courseId is required for course-scoped promo codes'));
  }
  next();
});

export const PromoCode = mongoose.model<IPromoCode>('PromoCode', promoCodeSchema);

