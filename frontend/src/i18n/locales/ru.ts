export default {
  // Common
  common: {
    loading: 'Загрузка...',
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    create: 'Создать',
    search: 'Поиск',
    filter: 'Фильтр',
    all: 'Все',
    actions: 'Действия',
    status: 'Статус',
    back: 'Назад',
    confirm: 'Подтвердить',
    yes: 'Да',
    no: 'Нет',
  },

  // Navigation
  nav: {
    dashboard: 'Аналитика',
    board: 'Канбан',
    table: 'Таблица',
    projects: 'Проекты',
    settings: 'Настройки',
    logout: 'Выход',
  },

  // Auth
  auth: {
    login: 'Вход',
    register: 'Регистрация',
    email: 'Email',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    firstName: 'Имя',
    lastName: 'Фамилия',
    forgotPassword: 'Забыли пароль?',
    resetPassword: 'Сброс пароля',
    sendResetLink: 'Отправить ссылку',
    verifyEmail: 'Подтверждение email',
    verifyEmailText: 'Мы отправили письмо на ваш email. Перейдите по ссылке для подтверждения.',
    loginSuccess: 'Вы успешно вошли в систему',
    registerSuccess: 'Регистрация успешна! Проверьте email.',
    invalidCredentials: 'Неверный email или пароль',
    noAccount: 'Нет аккаунта?',
    hasAccount: 'Уже есть аккаунт?',
  },

  // Dashboard
  dashboard: {
    title: 'Аналитика проектов',
    subtitle: 'Обзор текущего состояния проектов',
    totalProjects: 'Всего проектов',
    activeProjects: 'Активных',
    archivedProjects: 'В архиве',
    overdueProjects: 'Просрочено',
    dueSoonProjects: 'Скоро дедлайн',
    byDepartment: 'По отделам',
    byPriority: 'По приоритету',
    weeklyTrend: 'Динамика за 8 недель',
    created: 'Создано',
    completed: 'Завершено',
    priorityRed: 'Срочные',
    priorityYellow: 'Средние',
    priorityGreen: 'Обычные',
  },

  // Projects
  project: {
    title: 'Название',
    description: 'Описание',
    department: 'Отдел',
    startDate: 'Дата начала',
    dueDate: 'Дедлайн',
    priority: 'Приоритет',
    status: 'Статус',
    progress: 'Прогресс',
    responsible: 'Ответственные',
    stage: 'Стадия',
    tasks: 'Подзадачи',
    meetings: 'Планёрки',
    createProject: 'Создать проект',
    editProject: 'Редактировать проект',
    archiveProject: 'Архивировать',
    restoreProject: 'Восстановить',
    manualStage: 'Стадия (вручную)',
    manualStageWarning: 'Стадия установлена вручную',
    noProjects: 'Проектов пока нет',
    overdue: 'Просрочено',
    dueSoon: 'Скоро дедлайн',
  },

  // Tasks
  task: {
    title: 'Задача',
    addTask: 'Добавить задачу',
    assignee: 'Исполнитель',
    todo: 'К выполнению',
    inProgress: 'В работе',
    done: 'Выполнено',
    noTasks: 'Задач нет',
    TODO: 'К выполнению',
    IN_PROGRESS: 'В работе',
    DONE: 'Выполнено',
  },

  // Meetings
  meeting: {
    title: 'Планёрка',
    addNote: 'Добавить заметку',
    noNotes: 'Заметок пока нет',
    author: 'Автор',
  },

  // Documents
  documents: {
    title: 'Документы',
    add: 'Добавить',
    uploading: 'Загрузка...',
    empty: 'Нет прикрепленных документов',
    download: 'Скачать',
    delete: 'Удалить',
    confirmDelete: 'Удалить документ?',
    unknown: 'Неизвестно',
  },

  // Surveys
  survey: {
    title: 'Анкеты',
    create: 'Создать анкету',
    edit: 'Редактировать анкету',
    delete: 'Удалить',
    duplicate: 'Дублировать',
    viewResults: 'Посмотреть ответы',
    results: 'Результаты анкеты',
    empty: 'Анкеты ещё не созданы',
    completeToCreate: 'Доведите проект до 100% чтобы создать анкету',
    completeProjectFirst: 'Завершите проект (100%) чтобы создать анкету',
    requiresComplete: 'Требуется 100% выполнения',
    
    // Builder
    titleLabel: 'Название анкеты',
    titlePlaceholder: 'Введите название',
    description: 'Описание (необязательно)',
    descriptionPlaceholder: 'Краткое описание цели анкеты',
    settings: 'Настройки анкеты',
    anonymous: 'Анонимная анкета',
    anonymousHint: 'Респонденты не будут указывать ФИО и должность',
    allowMultiple: 'Разрешить повторные ответы',
    showProgress: 'Показывать прогресс заполнения',
    expiresAt: 'Дата окончания (необязательно)',
    thankYou: 'Сообщение после отправки',
    nonAnonymousHint: 'Перед вопросами анкеты респонденты укажут: ФИО, Должность, Отдел, Email',
    questions: 'Вопросы',
    addQuestion: 'Добавить вопрос',
    questionPlaceholder: 'Введите вопрос',
    required: 'Обязательный',
    option: 'Вариант',
    addOption: 'Добавить вариант',
    titleRequired: 'Введите название анкеты',
    questionsRequired: 'Добавьте хотя бы один вопрос',
    emptyQuestion: 'Заполните текст всех вопросов',
    saveFailed: 'Не удалось сохранить анкету',
    
    // Status
    statusDraft: 'Черновик',
    statusActive: 'Активна',
    statusClosed: 'Закрыта',
    activate: 'Запустить сбор',
    deactivate: 'Остановить сбор',
    
    // Links
    link: 'Ссылка',
    copyLink: 'Скопировать ссылку',
    openLink: 'Открыть анкету',
    
    // Results
    responses: 'ответов',
    responsesCount: 'ответов',
    questionsCount: 'вопросов',
    answersCount: 'ответов',
    summaryView: 'Сводка',
    individualView: 'По респондентам',
    exportCSV: 'Экспорт CSV',
    noResults: 'Не удалось загрузить результаты',
    noResponses: 'Пока нет ответов',
    noTextAnswers: 'Нет текстовых ответов',
    outOf5: 'из 5',
    anonymousRespondent: 'Анонимный респондент',
    noName: 'Без имени',
    respondentName: 'ФИО',
    respondentPosition: 'Должность',
    respondentDepartment: 'Отдел',
    respondentEmail: 'Email',
    confirmDelete: 'Удалить анкету? Все ответы будут потеряны.',
    
    // Public survey
    loadError: 'Не удалось загрузить анкету',
    submitError: 'Не удалось отправить ответы',
    error: 'Ошибка',
    thankYouDefault: 'Спасибо за участие!',
    canClose: 'Теперь вы можете закрыть эту страницу',
    aboutYou: 'О вас',
    fillInfo: 'Пожалуйста, укажите ваши данные',
    yourName: 'Ваше ФИО',
    namePlaceholder: 'Иванов Иван Иванович',
    yourPosition: 'Ваша должность',
    positionPlaceholder: 'Менеджер проектов',
    yourDepartment: 'Ваш отдел',
    departmentPlaceholder: 'IT отдел',
    yourEmail: 'Ваш Email',
    enterAnswer: 'Введите ваш ответ...',
    requiredField: 'Обязательный',
    questionOf: 'Вопрос',
    of: 'из',
    allDone: 'Вы ответили на все вопросы!',
    clickSubmit: 'Нажмите кнопку "Отправить" чтобы завершить',
    back: 'Назад',
    next: 'Далее',
    submit: 'Отправить',
    submitting: 'Отправка...',
    yes: 'Да',
    no: 'Нет',
  },

  // Departments
  department: {
    IT: 'IT отдел',
    DIGITALIZATION: 'Цифровизация',
  },

  // Status
  status: {
    ACTIVE: 'Активный',
    ARCHIVED: 'В архиве',
  },

  // Priority
  priority: {
    RED: 'Срочный',
    YELLOW: 'Средний',
    GREEN: 'Обычный',
  },

  // Board
  board: {
    title: 'Канбан доска',
    dragHint: 'Перетащите проект для изменения стадии',
    noProjectsInStage: 'Нет проектов',
  },

  // Table
  table: {
    title: 'Таблица проектов',
    showArchived: 'Показать архив',
    hideArchived: 'Скрыть архив',
  },

  // Stages
  stage: {
    start: 'Начало',
    planning: 'Планирование',
    inProgress: 'В работе',
    testing: 'Тестирование',
    completion: 'Завершение',
  },

  // Errors
  error: {
    generic: 'Произошла ошибка',
    notFound: 'Страница не найдена',
    unauthorized: 'Доступ запрещён',
    forbidden: 'Недостаточно прав',
    networkError: 'Ошибка сети',
  },

  // Roles
  role: {
    admin: 'Администратор',
    lead: 'Руководитель',
    member: 'Участник',
  },
};
