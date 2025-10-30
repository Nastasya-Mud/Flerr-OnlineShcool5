import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  name: string;
  photo: string;
  specialization: string;
  bio: string;
  experience: string;
  courses: mongoose.Types.ObjectId[];
  order: number;
  active: boolean;
  social?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const teacherSchema = new Schema<ITeacher>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    social: {
      instagram: String,
      facebook: String,
      website: String,
    },
  },
  {
    timestamps: true,
  }
);

teacherSchema.index({ order: 1 });
teacherSchema.index({ active: 1 });

export const Teacher = mongoose.model<ITeacher>('Teacher', teacherSchema);

