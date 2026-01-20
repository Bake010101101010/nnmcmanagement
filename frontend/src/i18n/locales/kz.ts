export default {
  // Common
  common: {
    loading: 'Жүктелуде...',
    save: 'Сақтау',
    cancel: 'Болдырмау',
    delete: 'Жою',
    edit: 'Өңдеу',
    create: 'Құру',
    search: 'Іздеу',
    filter: 'Сүзгі',
    all: 'Барлығы',
    actions: 'Әрекеттер',
    status: 'Күй',
    back: 'Артқа',
    confirm: 'Растау',
    yes: 'Иә',
    no: 'Жоқ',
  },

  // Navigation
  nav: {
    dashboard: 'Аналитика',
    board: 'Канбан',
    table: 'Кесте',
    projects: 'Жобалар',
    settings: 'Баптаулар',
    logout: 'Шығу',
  },

  // Auth
  auth: {
    login: 'Кіру',
    register: 'Тіркелу',
    email: 'Email',
    password: 'Құпия сөз',
    confirmPassword: 'Құпия сөзді растау',
    firstName: 'Аты',
    lastName: 'Тегі',
    forgotPassword: 'Құпия сөзді ұмыттыңыз ба?',
    resetPassword: 'Құпия сөзді қалпына келтіру',
    sendResetLink: 'Сілтеме жіберу',
    verifyEmail: 'Email растау',
    verifyEmailText: 'Біз сіздің email-ге хат жібердік. Растау үшін сілтемеге өтіңіз.',
    loginSuccess: 'Сіз жүйеге сәтті кірдіңіз',
    registerSuccess: 'Тіркелу сәтті! Email-ді тексеріңіз.',
    invalidCredentials: 'Email немесе құпия сөз қате',
    noAccount: 'Аккаунтыңыз жоқ па?',
    hasAccount: 'Аккаунтыңыз бар ма?',
  },

  // Dashboard
  dashboard: {
    title: 'Жобалар аналитикасы',
    subtitle: 'Жобалардың ағымдағы жағдайына шолу',
    totalProjects: 'Барлық жобалар',
    activeProjects: 'Белсенді',
    archivedProjects: 'Мұрағатта',
    overdueProjects: 'Мерзімі өткен',
    dueSoonProjects: 'Мерзімі жақын',
    byDepartment: 'Бөлімдер бойынша',
    byPriority: 'Басымдық бойынша',
    weeklyTrend: '8 апталық динамика',
    created: 'Құрылды',
    completed: 'Аяқталды',
    priorityRed: 'Шұғыл',
    priorityYellow: 'Орташа',
    priorityGreen: 'Қалыпты',
  },

  // Projects
  project: {
    title: 'Атауы',
    description: 'Сипаттама',
    department: 'Бөлім',
    startDate: 'Басталу күні',
    dueDate: 'Мерзімі',
    priority: 'Басымдық',
    status: 'Күй',
    progress: 'Орындалу',
    responsible: 'Жауаптылар',
    stage: 'Кезең',
    tasks: 'Тапсырмалар',
    meetings: 'Жиналыстар',
    createProject: 'Жоба құру',
    editProject: 'Жобаны өңдеу',
    archiveProject: 'Мұрағаттау',
    restoreProject: 'Қалпына келтіру',
    manualStage: 'Кезең (қолмен)',
    manualStageWarning: 'Кезең қолмен орнатылған',
    noProjects: 'Жобалар әлі жоқ',
    overdue: 'Мерзімі өткен',
    dueSoon: 'Мерзімі жақын',
  },

  // Tasks
  task: {
    title: 'Тапсырма',
    addTask: 'Тапсырма қосу',
    assignee: 'Орындаушы',
    todo: 'Орындауға',
    inProgress: 'Жұмыста',
    done: 'Орындалды',
    noTasks: 'Тапсырмалар жоқ',
  },

  // Meetings
  meeting: {
    title: 'Жиналыс',
    addNote: 'Жазба қосу',
    noNotes: 'Жазбалар әлі жоқ',
    author: 'Автор',
  },

  // Documents
  documents: {
    title: 'Құжаттар',
    add: 'Қосу',
    uploading: 'Жүктелуде...',
    empty: 'Тіркелген құжаттар жоқ',
    download: 'Жүктеп алу',
    delete: 'Жою',
    confirmDelete: 'Құжатты жою?',
    unknown: 'Белгісіз',
  },

  // Surveys
  survey: {
    title: 'Сауалнамалар',
    create: 'Сауалнама құру',
    edit: 'Сауалнаманы өңдеу',
    delete: 'Жою',
    duplicate: 'Көшірме жасау',
    viewResults: 'Жауаптарды көру',
    results: 'Сауалнама нәтижелері',
    empty: 'Сауалнамалар әлі құрылмаған',
    completeToCreate: 'Сауалнама құру үшін жобаны 100%-ға жеткізіңіз',
    completeProjectFirst: 'Сауалнама құру үшін жобаны аяқтаңыз (100%)',
    requiresComplete: '100% орындалуы қажет',
    
    // Builder
    titleLabel: 'Сауалнама атауы',
    titlePlaceholder: 'Атауын енгізіңіз',
    description: 'Сипаттама (міндетті емес)',
    descriptionPlaceholder: 'Сауалнама мақсатының қысқаша сипаттамасы',
    settings: 'Сауалнама баптаулары',
    anonymous: 'Анонимді сауалнама',
    anonymousHint: 'Респонденттер АТЖ мен лауазымын көрсетпейді',
    allowMultiple: 'Қайталама жауаптарға рұқсат беру',
    showProgress: 'Толтыру барысын көрсету',
    expiresAt: 'Аяқталу күні (міндетті емес)',
    thankYou: 'Жіберілгеннен кейінгі хабарлама',
    nonAnonymousHint: 'Сұрақтардан бұрын респонденттер көрсетеді: АТЖ, Лауазымы, Бөлімі, Email',
    questions: 'Сұрақтар',
    addQuestion: 'Сұрақ қосу',
    questionPlaceholder: 'Сұрақты енгізіңіз',
    required: 'Міндетті',
    option: 'Нұсқа',
    addOption: 'Нұсқа қосу',
    titleRequired: 'Сауалнама атауын енгізіңіз',
    questionsRequired: 'Кемінде бір сұрақ қосыңыз',
    emptyQuestion: 'Барлық сұрақтардың мәтінін толтырыңыз',
    saveFailed: 'Сауалнаманы сақтау сәтсіз аяқталды',
    
    // Status
    statusDraft: 'Жоба',
    statusActive: 'Белсенді',
    statusClosed: 'Жабық',
    activate: 'Жинауды бастау',
    deactivate: 'Жинауды тоқтату',
    
    // Links
    link: 'Сілтеме',
    copyLink: 'Сілтемені көшіру',
    openLink: 'Сауалнаманы ашу',
    
    // Results
    responses: 'жауап',
    responsesCount: 'жауап',
    questionsCount: 'сұрақ',
    answersCount: 'жауап',
    summaryView: 'Жиынтық',
    individualView: 'Респонденттер бойынша',
    exportCSV: 'CSV экспорттау',
    noResults: 'Нәтижелерді жүктеу сәтсіз аяқталды',
    noResponses: 'Әлі жауаптар жоқ',
    noTextAnswers: 'Мәтіндік жауаптар жоқ',
    outOf5: '5-тен',
    anonymousRespondent: 'Анонимді респондент',
    noName: 'Атсыз',
    respondentName: 'АТЖ',
    respondentPosition: 'Лауазымы',
    respondentDepartment: 'Бөлімі',
    respondentEmail: 'Email',
    confirmDelete: 'Сауалнаманы жою? Барлық жауаптар жоғалады.',
    
    // Public survey
    loadError: 'Сауалнаманы жүктеу сәтсіз аяқталды',
    submitError: 'Жауаптарды жіберу сәтсіз аяқталды',
    error: 'Қате',
    thankYouDefault: 'Қатысқаныңыз үшін рахмет!',
    canClose: 'Енді бұл бетті жабуға болады',
    aboutYou: 'Сіз туралы',
    fillInfo: 'Деректеріңізді көрсетіңіз',
    yourName: 'Сіздің АТЖ',
    namePlaceholder: 'Иванов Иван Иванович',
    yourPosition: 'Сіздің лауазымыңыз',
    positionPlaceholder: 'Жоба менеджері',
    yourDepartment: 'Сіздің бөліміңіз',
    departmentPlaceholder: 'IT бөлімі',
    yourEmail: 'Сіздің Email',
    enterAnswer: 'Жауабыңызды енгізіңіз...',
    requiredField: 'Міндетті',
    questionOf: 'Сұрақ',
    of: '/',
    allDone: 'Сіз барлық сұрақтарға жауап бердіңіз!',
    clickSubmit: 'Аяқтау үшін "Жіберу" батырмасын басыңыз',
    back: 'Артқа',
    next: 'Келесі',
    submit: 'Жіберу',
    submitting: 'Жіберілуде...',
    yes: 'Иә',
    no: 'Жоқ',
  },

  // Departments
  department: {
    IT: 'IT бөлімі',
    DIGITALIZATION: 'Цифрландыру',
  },

  // Status
  status: {
    ACTIVE: 'Белсенді',
    ARCHIVED: 'Мұрағатта',
  },

  // Priority
  priority: {
    RED: 'Шұғыл',
    YELLOW: 'Орташа',
    GREEN: 'Қалыпты',
  },

  // Board
  board: {
    title: 'Канбан тақтасы',
    dragHint: 'Кезеңді өзгерту үшін жобаны сүйреңіз',
    noProjectsInStage: 'Жобалар жоқ',
  },

  // Table
  table: {
    title: 'Жобалар кестесі',
    showArchived: 'Мұрағатты көрсету',
    hideArchived: 'Мұрағатты жасыру',
  },

  // Stages
  stage: {
    start: 'Бастау',
    planning: 'Жоспарлау',
    inProgress: 'Жұмыста',
    testing: 'Тестілеу',
    completion: 'Аяқтау',
  },

  // Errors
  error: {
    generic: 'Қате орын алды',
    notFound: 'Бет табылмады',
    unauthorized: 'Кіруге тыйым салынған',
    forbidden: 'Құқықтар жеткіліксіз',
    networkError: 'Желі қатесі',
  },

  // Roles
  role: {
    admin: 'Әкімші',
    lead: 'Жетекші',
    member: 'Қатысушы',
  },
};
