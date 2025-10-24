import mongoose, { Schema, Document } from 'mongoose';

export interface IActivation extends Document {
  userId: mongoose.Types.ObjectId;
  promoCodeId: mongoose.Types.ObjectId;
  activatedAt: Date;
  ip?: string;
  userAgent?: string;
}

const activationSchema = new Schema<IActivation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    promoCodeId: {
      type: Schema.Types.ObjectId,
      ref: 'PromoCode',
      required: true,
      index: true,
    },
    activatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: false,
  }
);

// Составной индекс для предотвращения дублирования активаций
activationSchema.index({ userId: 1, promoCodeId: 1 }, { unique: true });

export const Activation = mongoose.model<IActivation>('Activation', activationSchema);

