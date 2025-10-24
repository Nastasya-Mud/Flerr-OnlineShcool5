import dotenv from 'dotenv';
import { connectDB } from '../db/connect.js';
import { User, Course, Lesson, PromoCode } from '../db/models/index.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Lesson.deleteMany({}),
      PromoCode.deleteMany({}),
    ]);

    console.log('👤 Creating users...');
    
    const admin = await User.create({
      email: 'admin@flerr.ru',
      passwordHash: 'admin123',
      name: 'Администратор',
      roles: ['admin', 'student'],
    });

    const student = await User.create({
      email: 'student@flerr.ru',
      passwordHash: 'student123',
      name: 'Анна Иванова',
      roles: ['student'],
    });

    console.log('📚 Creating courses...');

    const course1 = await Course.create({
      title: 'Основы флористики',
      slug: 'osnovy-floristiki',
      description:
        'Погрузитесь в мир флористики с нашим базовым курсом. Вы научитесь основным техникам работы с цветами, узнаете о композиции, цветовых сочетаниях и уходе за растениями. Этот курс идеально подходит для начинающих флористов и всех, кто хочет создавать красивые букеты своими руками.',
      shortDescription: 'Изучите базовые техники работы с цветами и создания композиций',
      level: 'beginner',
      categories: ['основы', 'для начинающих'],
      coverUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946',
      published: true,
      instructor: 'Мария Петрова',
      duration: 180,
      studentsCount: 234,
      rating: 4.8,
    });

    const course2 = await Course.create({
      title: 'Свадебная флористика',
      slug: 'svadebnaya-floristika',
      description:
        'Специализированный курс по созданию свадебных букетов и декора. Научитесь работать с сезонными цветами, создавать каскадные букеты, бутоньерки и флористические композиции для оформления торжества. Узнайте секреты работы с заказчиками и организации свадебных проектов.',
      shortDescription: 'Создание свадебных букетов и декора',
      level: 'intermediate',
      categories: ['свадебная флористика', 'букеты'],
      coverUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed',
      published: true,
      instructor: 'Елена Соколова',
      duration: 240,
      studentsCount: 156,
      rating: 4.9,
    });

    const course3 = await Course.create({
      title: 'Сезонные композиции',
      slug: 'sezonnye-kompozitsii',
      description:
        'Научитесь создавать уникальные композиции для каждого времени года. Весенние первоцветы, летнее буйство красок, осенняя палитра и зимние праздничные композиции. Работа с природными материалами, ветками, ягодами и нетрадиционными элементами декора.',
      shortDescription: 'Композиции для каждого сезона года',
      level: 'intermediate',
      categories: ['композиции', 'сезонные проекты'],
      coverUrl: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d',
      published: true,
      instructor: 'Ольга Васильева',
      duration: 200,
      studentsCount: 98,
      rating: 4.7,
    });

    console.log('📖 Creating lessons for Course 1...');

    const lesson1_1 = await Lesson.create({
      courseId: course1._id,
      title: 'Введение в флористику',
      slug: 'vvedenie-v-floristiku',
      description: 'Знакомство с основами флористики, инструментами и материалами',
      durationSec: 900,
      videoKey: 'videos/osnovy-floristiki/lesson1/intro.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a',
      freePreview: true,
      order: 1,
      chapters: [
        { title: 'Приветствие', timeSec: 0 },
        { title: 'Что такое флористика', timeSec: 120 },
        { title: 'Необходимые инструменты', timeSec: 300 },
        { title: 'Материалы для работы', timeSec: 600 },
      ],
    });

    const lesson1_2 = await Lesson.create({
      courseId: course1._id,
      title: 'Основы композиции',
      slug: 'osnovy-kompozitsii',
      description: 'Изучаем принципы построения флористической композиции',
      durationSec: 1200,
      videoKey: 'videos/osnovy-floristiki/lesson2/composition.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d',
      order: 2,
      materials: [
        {
          title: 'Конспект урока',
          url: 'materials/osnovy-floristiki/lesson2/notes.pdf',
          type: 'pdf',
        },
      ],
      chapters: [
        { title: 'Правило третей', timeSec: 0 },
        { title: 'Цветовой круг', timeSec: 300 },
        { title: 'Форма и объем', timeSec: 600 },
        { title: 'Практические примеры', timeSec: 900 },
      ],
    });

    const lesson1_3 = await Lesson.create({
      courseId: course1._id,
      title: 'Работа с цветом',
      slug: 'rabota-s-tsvetom',
      description: 'Цветовые сочетания и гармония в флористике',
      durationSec: 1500,
      videoKey: 'videos/osnovy-floristiki/lesson3/color.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa',
      order: 3,
      chapters: [
        { title: 'Теория цвета', timeSec: 0 },
        { title: 'Монохромные композиции', timeSec: 400 },
        { title: 'Контрастные сочетания', timeSec: 800 },
        { title: 'Нюансные палитры', timeSec: 1200 },
      ],
    });

    // Обновляем курс со ссылками на уроки
    course1.lessons = [lesson1_1._id, lesson1_2._id, lesson1_3._id];
    await course1.save();

    console.log('📖 Creating lessons for Course 2...');

    const lesson2_1 = await Lesson.create({
      courseId: course2._id,
      title: 'Свадебные букеты: стили и формы',
      slug: 'svadebnye-bukety-stili',
      description: 'Обзор популярных стилей свадебных букетов',
      durationSec: 1800,
      videoKey: 'videos/svadebnaya-floristika/lesson1/styles.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519167758481-83f29da8c8d5',
      freePreview: true,
      order: 1,
    });

    const lesson2_2 = await Lesson.create({
      courseId: course2._id,
      title: 'Каскадный букет невесты',
      slug: 'kaskadnyy-buket',
      description: 'Техника создания элегантного каскадного букета',
      durationSec: 2400,
      videoKey: 'videos/svadebnaya-floristika/lesson2/cascade.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486',
      order: 2,
      materials: [
        {
          title: 'Список необходимых материалов',
          url: 'materials/svadebnaya-floristika/lesson2/materials.pdf',
          type: 'pdf',
        },
      ],
    });

    course2.lessons = [lesson2_1._id, lesson2_2._id];
    await course2.save();

    console.log('🎫 Creating promo codes...');

    await PromoCode.create({
      code: 'WELCOME2024',
      scope: 'platform',
      maxUses: 100,
      usedCount: 0,
      expiresAt: new Date('2025-12-31'),
      isActive: true,
      createdBy: admin._id,
      notes: 'Платформенный промокод для новых пользователей',
    });

    await PromoCode.create({
      code: 'FLOWERS101',
      scope: 'course',
      courseId: course1._id,
      maxUses: 50,
      usedCount: 0,
      expiresAt: new Date('2025-12-31'),
      isActive: true,
      createdBy: admin._id,
      notes: 'Промокод для курса "Основы флористики"',
    });

    await PromoCode.create({
      code: 'WEDDING2024',
      scope: 'course',
      courseId: course2._id,
      maxUses: 30,
      usedCount: 0,
      expiresAt: new Date('2025-12-31'),
      isActive: true,
      createdBy: admin._id,
      notes: 'Промокод для курса "Свадебная флористика"',
    });

    await PromoCode.create({
      code: 'EXPIRED',
      scope: 'platform',
      maxUses: 10,
      usedCount: 0,
      expiresAt: new Date('2024-01-01'),
      isActive: true,
      createdBy: admin._id,
      notes: 'Тестовый истекший промокод',
    });

    console.log('✅ Seed completed successfully!');
    console.log('\n📊 Created:');
    console.log(`   - 2 users (admin@flerr.ru / student@flerr.ru)`);
    console.log(`   - 3 courses`);
    console.log(`   - 5 lessons`);
    console.log(`   - 4 promo codes`);
    console.log('\n🔑 Test credentials:');
    console.log('   Admin: admin@flerr.ru / admin123');
    console.log('   Student: student@flerr.ru / student123');
    console.log('\n🎫 Test promo codes:');
    console.log('   WELCOME2024 - platform access');
    console.log('   FLOWERS101 - "Основы флористики" course');
    console.log('   WEDDING2024 - "Свадебная флористика" course');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();

