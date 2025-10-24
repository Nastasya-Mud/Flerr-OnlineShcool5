import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  durationSec: number;
  videoKey: string;
  thumbnailUrl?: string;
  subtitlesUrl?: string;
  materials: {
    title: string;
    url: string;
    type: string;
  }[];
  chapters?: {
    title: string;
    timeSec: number;
  }[];
  freePreview: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    durationSec: {
      type: Number,
      required: true,
      default: 0,
    },
    videoKey: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    subtitlesUrl: {
      type: String,
    },
    materials: [
      {
        title: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          default: 'pdf',
        },
      },
    ],
    chapters: [
      {
        title: {
          type: String,
          required: true,
        },
        timeSec: {
          type: Number,
          required: true,
        },
      },
    ],
    freePreview: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Составной индекс для уникальности slug внутри курса
lessonSchema.index({ courseId: 1, slug: 1 }, { unique: true });
lessonSchema.index({ courseId: 1, order: 1 });

export const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);

