import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  roles: ('student' | 'admin')[];
  favorites: mongoose.Types.ObjectId[];
  progress: Map<string, number>;
  activatedPromoCodes: {
    codeId: mongoose.Types.ObjectId;
    courseIds?: mongoose.Types.ObjectId[];
    globalAccess?: boolean;
    activatedAt: Date;
  }[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    roles: {
      type: [String],
      enum: ['student', 'admin'],
      default: ['student'],
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    progress: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    activatedPromoCodes: [
      {
        codeId: {
          type: Schema.Types.ObjectId,
          ref: 'PromoCode',
          required: true,
        },
        courseIds: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Course',
          },
        ],
        globalAccess: {
          type: Boolean,
          default: false,
        },
        activatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Хеширование пароля перед сохранением
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Метод для проверки пароля
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', userSchema);

