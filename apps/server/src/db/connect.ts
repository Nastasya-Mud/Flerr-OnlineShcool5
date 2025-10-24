import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flerr', {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    
    // Создание индексов
    await createIndexes();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

async function createIndexes() {
  try {
    const { Course, Lesson, PromoCode, User } = await import('./models/index.js');
    
    await Course.createIndexes();
    await Lesson.createIndexes();
    await PromoCode.createIndexes();
    await User.createIndexes();
    
    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('⚠️ Error creating indexes:', error);
  }
}

