/**
 * Seed script для NNMC IT Project Board
 * Создаёт начальные данные: отделы, стадии, тестовые проекты
 */

const seedData = async () => {
  const strapi = (global as any).strapi;

  console.log('🌱 Starting seed...');

  // 1. Seed Departments
  console.log('📁 Creating departments...');
  const departments = [
    { key: 'IT', name_ru: 'Отдел IT', name_kz: 'IT бөлімі' },
    { key: 'DIGITALIZATION', name_ru: 'Отдел цифровизации', name_kz: 'Цифрландыру бөлімі' },
  ];

  const createdDepartments: Record<string, any> = {};
  for (const dept of departments) {
    const existing = await strapi.entityService.findMany('api::department.department', {
      filters: { key: dept.key },
    });
    
    if (existing.length === 0) {
      const created = await strapi.entityService.create('api::department.department', {
        data: dept,
      });
      createdDepartments[dept.key] = created;
      console.log(`  ✅ Created department: ${dept.name_ru}`);
    } else {
      createdDepartments[dept.key] = existing[0];
      console.log(`  ⏭️ Department exists: ${dept.name_ru}`);
    }
  }

  // 2. Seed BoardStages
  console.log('📊 Creating board stages...');
  const stages = [
    { name_ru: 'Начало', name_kz: 'Бастау', minPercent: 0, maxPercent: 20, order: 1, color: '#EF4444' },
    { name_ru: 'Планирование', name_kz: 'Жоспарлау', minPercent: 20, maxPercent: 40, order: 2, color: '#F97316' },
    { name_ru: 'В работе', name_kz: 'Жұмыста', minPercent: 40, maxPercent: 60, order: 3, color: '#EAB308' },
    { name_ru: 'Тестирование', name_kz: 'Тестілеу', minPercent: 60, maxPercent: 80, order: 4, color: '#22C55E' },
    { name_ru: 'Завершение', name_kz: 'Аяқтау', minPercent: 80, maxPercent: 99, order: 5, color: '#14B8A6' },
    { name_ru: 'Промышленная эксплуатация', name_kz: 'Өнеркәсіптік пайдалану', minPercent: 99, maxPercent: 101, order: 6, color: '#0EA5E9' },
  ];

  const createdStages: any[] = [];
  for (const stage of stages) {
    const existing = await strapi.entityService.findMany('api::board-stage.board-stage', {
      filters: { minPercent: stage.minPercent },
    });
    
    if (existing.length === 0) {
      const created = await strapi.entityService.create('api::board-stage.board-stage', {
        data: stage,
      });
      createdStages.push(created);
      console.log(`  ✅ Created stage: ${stage.name_ru}`);
    } else {
      createdStages.push(existing[0]);
      console.log(`  ⏭️ Stage exists: ${stage.name_ru}`);
    }
  }

  // 3. Seed sample projects
  console.log('🚀 Creating sample projects...');
  
  const sampleProjects = [
    {
      title: 'Внедрение МИС "Damumed"',
      description: 'Интеграция медицинской информационной системы во все подразделения',
      department: createdDepartments['DIGITALIZATION'].id,
      startDate: '2024-01-15',
      dueDate: '2024-06-30',
      status: 'ACTIVE',
      priorityLight: 'RED',
      tasks: [
        { title: 'Анализ требований', status: 'DONE', order: 1 },
        { title: 'Настройка серверной инфраструктуры', status: 'DONE', order: 2 },
        { title: 'Миграция данных пациентов', status: 'IN_PROGRESS', order: 3 },
        { title: 'Обучение персонала', status: 'TODO', order: 4 },
        { title: 'Тестирование', status: 'TODO', order: 5 },
      ],
    },
    {
      title: 'Обновление сетевой инфраструктуры',
      description: 'Замена коммутаторов и прокладка нового кабеля',
      department: createdDepartments['IT'].id,
      startDate: '2024-02-01',
      dueDate: '2024-04-15',
      status: 'ACTIVE',
      priorityLight: 'YELLOW',
      tasks: [
        { title: 'Закупка оборудования', status: 'DONE', order: 1 },
        { title: 'Монтаж кабельной системы', status: 'DONE', order: 2 },
        { title: 'Настройка VLAN', status: 'DONE', order: 3 },
        { title: 'Тестирование скорости', status: 'IN_PROGRESS', order: 4 },
      ],
    },
    {
      title: 'Разработка портала пациента',
      description: 'Личный кабинет для записи на приём и просмотра результатов',
      department: createdDepartments['DIGITALIZATION'].id,
      startDate: '2024-03-01',
      dueDate: '2024-12-31',
      status: 'ACTIVE',
      priorityLight: 'GREEN',
      tasks: [
        { title: 'UI/UX дизайн', status: 'DONE', order: 1 },
        { title: 'Разработка API', status: 'IN_PROGRESS', order: 2 },
        { title: 'Фронтенд разработка', status: 'TODO', order: 3 },
        { title: 'Интеграция с МИС', status: 'TODO', order: 4 },
        { title: 'Безопасность и GDPR', status: 'TODO', order: 5 },
        { title: 'Мобильная версия', status: 'TODO', order: 6 },
      ],
    },
    {
      title: 'Система видеонаблюдения',
      description: 'Установка IP-камер и сервера видеоархива',
      department: createdDepartments['IT'].id,
      startDate: '2024-01-01',
      dueDate: '2024-03-01',
      status: 'ARCHIVED',
      priorityLight: 'GREEN',
      tasks: [
        { title: 'Проектирование системы', status: 'DONE', order: 1 },
        { title: 'Закупка камер', status: 'DONE', order: 2 },
        { title: 'Монтаж', status: 'DONE', order: 3 },
        { title: 'Настройка NVR', status: 'DONE', order: 4 },
      ],
    },
    {
      title: 'Модернизация ЦОД',
      description: 'Обновление серверного оборудования и СХД',
      department: createdDepartments['IT'].id,
      startDate: '2024-04-01',
      dueDate: '2024-08-31',
      status: 'ACTIVE',
      priorityLight: 'RED',
      tasks: [
        { title: 'Аудит текущего оборудования', status: 'DONE', order: 1 },
        { title: 'Составление ТЗ', status: 'DONE', order: 2 },
        { title: 'Тендерные процедуры', status: 'IN_PROGRESS', order: 3 },
        { title: 'Поставка оборудования', status: 'TODO', order: 4 },
        { title: 'Миграция сервисов', status: 'TODO', order: 5 },
      ],
    },
  ];

  for (const projectData of sampleProjects) {
    const { tasks, ...projectFields } = projectData;
    
    const existing = await strapi.entityService.findMany('api::project.project', {
      filters: { title: projectFields.title },
    });

    if (existing.length === 0) {
      const project = await strapi.entityService.create('api::project.project', {
        data: projectFields,
      });

      // Create tasks
      for (const task of tasks) {
        await strapi.entityService.create('api::task.task', {
          data: {
            ...task,
            project: project.id,
          },
        });
      }

      console.log(`  ✅ Created project: ${projectFields.title} with ${tasks.length} tasks`);
    } else {
      console.log(`  ⏭️ Project exists: ${projectFields.title}`);
    }
  }

  console.log('✨ Seed completed!');
};

export default seedData;
