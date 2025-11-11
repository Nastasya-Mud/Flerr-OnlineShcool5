import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../db/connect.js';
import { Teacher, Gallery, Course } from '../db/models/index.js';

// Функция для исправления URL изображений
function fixImageUrl(url: string): string {
  if (!url) return url;
  
  try {
    // Исправляем ibb.co → i.ibb.co (Direct link)
    if (url.includes('ibb.co/') && !url.includes('i.ibb.co/')) {
      url = url.replace('ibb.co/', 'i.ibb.co/');
      // Убираем путь к странице, оставляем только имя файла
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      if (!filename.includes('.')) {
        // Если нет расширения, добавляем .jpg (ImgBB обычно использует jpg)
        url = url + '.jpg';
      }
    }
    
    // Оптимизируем Unsplash URL
    if (url.includes('images.unsplash.com')) {
      const urlObj = new URL(url);
      if (!urlObj.searchParams.has('w')) urlObj.searchParams.set('w', '800');
      if (!urlObj.searchParams.has('q')) urlObj.searchParams.set('q', '80');
      if (!urlObj.searchParams.has('auto')) urlObj.searchParams.set('auto', 'format');
      if (!urlObj.searchParams.has('fit')) urlObj.searchParams.set('fit', 'crop');
      url = urlObj.toString();
    }
    
    return url;
  } catch (error) {
    console.error('Error fixing URL:', url, error);
    return url;
  }
}

const repairData = async () => {
  try {
    console.log('🔧 Starting repair script...');
    console.log('📝 This script will:');
    console.log('   1. Fix image URLs in courses (ibb.co → i.ibb.co, optimize Unsplash)');
    console.log('   2. Update teacher photos (restore original images)');
    console.log('   3. Update gallery images (restore original images)');
    console.log('   4. Keep all existing courses and data');
    console.log('');

    await connectDB();
    console.log('✅ Connected to database');

    // 1. Исправляем изображения в курсах
    console.log('\n📚 Fixing course images...');
    const courses = await Course.find({});
    let coursesFixed = 0;
    
    for (const course of courses) {
      if (course.coverUrl) {
        const originalUrl = course.coverUrl;
        const fixedUrl = fixImageUrl(originalUrl);
        
        if (originalUrl !== fixedUrl) {
          course.coverUrl = fixedUrl;
          await course.save();
          coursesFixed++;
          console.log(`   ✅ Fixed: ${course.title}`);
        }
      }
    }
    console.log(`   📊 Fixed ${coursesFixed} course(s)`);

    // 2. Обновляем преподавателей
    console.log('\n👨‍🏫 Updating teachers...');
    
    const teachersData = [
      {
        name: 'Мария Петрова',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80&auto=format&fit=crop',
        specialization: 'Основы флористики и композиции',
        bio: 'Профессиональный флорист с 15-летним опытом. Член Российской гильдии флористов. Преподаю искусство создания букетов и композиций, работаю с различными стилями и техниками.',
        experience: '15+ лет в профессиональной флористике',
        order: 1,
        active: true,
        social: {
          instagram: 'https://instagram.com/maria_flowers',
          website: 'https://maria-floristry.com',
        },
      },
      {
        name: 'Елена Соколова',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80&auto=format&fit=crop',
        specialization: 'Свадебная флористика',
        bio: 'Специалист по свадебной флористике, создатель уникальных букетов и декора для самого важного дня. Работала на более чем 200 свадебных церемониях, включая celebrity-мероприятия.',
        experience: '10+ лет в свадебной флористике',
        order: 2,
        active: true,
        social: {
          instagram: 'https://instagram.com/elena_wedding_flowers',
        },
      },
      {
        name: 'Ольга Васильева',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80&auto=format&fit=crop',
        specialization: 'Сезонные композиции и декор',
        bio: 'Эксперт по работе с сезонными цветами и природными материалами. Создаю уникальные композиции для каждого времени года, использую нетрадиционные элементы декора.',
        experience: '12+ лет флористического дизайна',
        order: 3,
        active: true,
        social: {
          instagram: 'https://instagram.com/olga_seasonal_art',
          website: 'https://olga-flowers.ru',
        },
      },
    ];

    let teachersUpdated = 0;
    let teachersCreated = 0;

    for (const teacherData of teachersData) {
      const existingTeacher = await Teacher.findOne({ name: teacherData.name });
      
      if (existingTeacher) {
        // Обновляем существующего преподавателя
        existingTeacher.photo = teacherData.photo;
        existingTeacher.specialization = teacherData.specialization;
        existingTeacher.bio = teacherData.bio;
        existingTeacher.experience = teacherData.experience;
        existingTeacher.order = teacherData.order;
        existingTeacher.active = teacherData.active;
        existingTeacher.social = teacherData.social;
        await existingTeacher.save();
        teachersUpdated++;
        console.log(`   ✅ Updated: ${teacherData.name}`);
      } else {
        // Создаем нового преподавателя (если не найден)
        await Teacher.create(teacherData);
        teachersCreated++;
        console.log(`   ✅ Created: ${teacherData.name}`);
      }
    }
    console.log(`   📊 Updated ${teachersUpdated}, created ${teachersCreated} teacher(s)`);

    // 3. Обновляем галерею
    console.log('\n🖼️  Updating gallery...');
    
    const galleryData = [
      {
        title: 'Нежный букет невесты',
        imageUrl: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=800&q=80&auto=format&fit=crop',
        category: 'свадьбы',
        description: 'Элегантный свадебный букет с пионовидными розами в нежно-розовых тонах',
        order: 1,
        featured: true,
      },
      {
        title: 'Букет в шляпной коробке',
        imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80&auto=format&fit=crop',
        category: 'композиции',
        description: 'Роскошная композиция из роз и пионов в элегантной коробке',
        order: 2,
        featured: true,
      },
      {
        title: 'Пудровая композиция',
        imageUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80&auto=format&fit=crop',
        category: 'букеты',
        description: 'Воздушный букет в пудровых тонах с розами и декоративной зеленью',
        order: 3,
        featured: true,
      },
      {
        title: 'Свадебный букет с эвкалиптом',
        imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80&auto=format&fit=crop',
        category: 'свадьбы',
        description: 'Богемный букет с розами, пионами и эвкалиптом',
        order: 4,
        featured: true,
      },
      {
        title: 'Яркий летний букет',
        imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80&auto=format&fit=crop',
        category: 'букеты',
        description: 'Сочная композиция из пионов и роз в ярких тонах',
        order: 5,
        featured: true,
      },
      {
        title: 'Классический букет роз',
        imageUrl: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800&q=80&auto=format&fit=crop',
        category: 'букеты',
        description: 'Элегантный монохромный букет из белых роз',
        order: 6,
        featured: true,
      },
      {
        title: 'Композиция с пионами',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
        category: 'композиции',
        description: 'Нежная настольная композиция с пионами в пастельных тонах',
        order: 7,
        featured: true,
      },
      {
        title: 'Авторский букет',
        imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80&auto=format&fit=crop',
        category: 'букеты',
        description: 'Дизайнерская композиция в современном стиле с розами и зеленью',
        order: 8,
        featured: true,
      },
    ];

    let galleryUpdated = 0;
    let galleryCreated = 0;

    for (const itemData of galleryData) {
      const existingItem = await Gallery.findOne({ title: itemData.title });
      
      if (existingItem) {
        // Обновляем существующий элемент
        existingItem.imageUrl = itemData.imageUrl;
        existingItem.category = itemData.category;
        existingItem.description = itemData.description;
        existingItem.order = itemData.order;
        existingItem.featured = itemData.featured;
        await existingItem.save();
        galleryUpdated++;
        console.log(`   ✅ Updated: ${itemData.title}`);
      } else {
        // Создаем новый элемент (если не найден)
        await Gallery.create(itemData);
        galleryCreated++;
        console.log(`   ✅ Created: ${itemData.title}`);
      }
    }
    console.log(`   📊 Updated ${galleryUpdated}, created ${galleryCreated} gallery item(s)`);

    // 4. Исправляем все остальные изображения в галерее (которые не в списке выше)
    console.log('\n🔍 Fixing other gallery items...');
    const allGalleryItems = await Gallery.find({});
    let otherGalleryFixed = 0;
    
    for (const item of allGalleryItems) {
      if (item.imageUrl) {
        const originalUrl = item.imageUrl;
        const fixedUrl = fixImageUrl(originalUrl);
        
        if (originalUrl !== fixedUrl) {
          item.imageUrl = fixedUrl;
          await item.save();
          otherGalleryFixed++;
          console.log(`   ✅ Fixed: ${item.title}`);
        }
      }
    }
    console.log(`   📊 Fixed ${otherGalleryFixed} other gallery item(s)`);

    console.log('\n✅ Repair completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Courses: ${coursesFixed} image(s) fixed`);
    console.log(`   - Teachers: ${teachersUpdated} updated, ${teachersCreated} created`);
    console.log(`   - Gallery: ${galleryUpdated} updated, ${galleryCreated} created, ${otherGalleryFixed} other items fixed`);
    console.log('\n🎉 All images have been restored and fixed!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Repair failed:', error);
    process.exit(1);
  }
};

repairData();

