
import { TenseData, VocabularyCategory } from './types';

export const UI_STRINGS = {
  en: {
    appName: "TenseGenius",
    dashboard: "Learning Path",
    basics: "The Foundation",
    vocabulary: "Vocabulary",
    learn: "Explore",
    practice: "Practice",
    aiAssistant: "Panda Teacher",
    streak: "Streak",
    xp: "XP",
    unlockLevel: "Unlock",
    backToDashboard: "Back",
    nextLesson: "Next",
    askAi: "Ask Teacher Panda...",
    writeSentences: "Write sentences. Focus on Subject + Verb agreement!",
    submitPractice: "Analyze my English",
    basicsTitle: "Step 0: The Core",
    basicsSubtitle: "Mastering how the Subject (Who) controls the Verb (Action).",
    whatIsSentence: "Sentence Logic",
    sentenceExplanation: "A sentence is like a team. The Subject is the Captain, and the Verb is the Action. They must agree!",
    subject: "1. Subject (Ega)",
    subjectDesc: "The hero/boss of the sentence. (I, You, We, They, He, She, It, Tom)",
    verb: "2. Verb (Fe'l)",
    verbDesc: "The action. It changes shape based on the Subject. (Go vs Goes)",
    object: "3. Object (To'ldiruvchi)",
    objectDesc: "Receives the action. (English, Apple, School)",
    formula: "S + V + O Formula",
    agreement: "Subject-Verb Agreement (Tobelik)",
    agreementDesc: "If the Subject is singular (He/She/It), the Verb often changes!",
    switchLang: "O'zbekcha",
    timeline: "Timeline",
    structureTable: "The Formula Map",
    positive: "Positive (+)",
    negative: "Negative (-)",
    question: "Question (?)",
    shortAnswers: "Short Answers",
    examples: "Mastery Examples",
    examplesSub: "Real-world Subject-Verb connections.",
    mistakes: "Critical Pitfalls",
    mistakesSub: "Common mistakes in this tense.",
    finalTask: "Global Mastery Task",
    finalTaskPrompt: "Tell your life story using mixed tenses (120-180 words).",
    startJourney: "Start Journey",
    level: "Level",
    important: "Teacher's Tip:",
    comparison: "Comparison",
    comparisonSub: "Subtle differences.",
    vocabTitle: "Vocabulary",
    vocabSubtitle: "Bricks for your sentences.",
    writingVocab: "Writing Tools",
    searchVocab: "Search words...",
    wordInfo: "Detail",
    hideTranslation: "Hide Uzb",
    showTranslation: "Show Uzb",
    visualExample: "Complete Visual Example",
    who: "Who?",
    doWhat: "Do what?",
    what: "What?",
    svoHeading: "Basic Sentence Structure: S + V + O",
    svoSub: "Asosiy gap tuzilishi: Ega + Fe'l + To'ldiruvchi (S + V + O)",
    whatIsTense: "What is Tense?",
    tenseExplanation: "Tense tells us when an action happens. It shows if something happened in the past, is happening now, or will happen in the future.",
    pastLabel: "Past",
    presentLabel: "Present",
    futureLabel: "Future",
    alreadyHappened: "Already happened",
    happeningNow: "Happening now",
    willHappenLater: "Will happen later",
    actionFinished: "Action is finished",
    actionCurrent: "Action is current",
    actionPlanned: "Action is planned",
    aboutPlatform: "About the Platform",
    platformPurpose: "What does this site teach?",
    platformDesc: "TenseGenius is an AI-driven platform specifically designed to help students master the 16 English tenses through a structured multi-level system.",
    aboutDev: "About the Developer",
    devBio: "Sodiqjon Mukhtorov is a passionate young web developer specializing in creating intelligent educational tools.",
    telegramProfile: "Telegram profile",
    login: "Login",
    register: "Sign Up",
    fullName: "Full Name",
    username: "Username",
    phone: "Phone Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",
    loginBtn: "Enter",
    registerBtn: "Create Account",
    confirmed: "Confirmed!",
    logout: "Leave",
    userCode: "Your ID Code",
    adminPanel: "Admin Control",
    giftXp: "Gift XP",
    enterCode: "Enter User Code",
    amount: "XP Amount",
    send: "Send",
    usersList: "Registered Users"
  },
  uz: {
    appName: "TenseGenius",
    dashboard: "O'quv Yo'li",
    basics: "Asoslar",
    vocabulary: "Lug'at",
    learn: "O'rganish",
    practice: "Mashq",
    aiAssistant: "Panda Ustoz",
    streak: "Kun",
    xp: "XP",
    unlockLevel: "Ochish",
    backToDashboard: "Orqaga",
    nextLesson: "Keyingi",
    askAi: "Pandadan so'rash...",
    writeSentences: "Gaplar yozing. Ega va Fe'l moslashuviga (tobelikka) e'tibor bering!",
    submitPractice: "AI Tahlili",
    basicsTitle: "0-qadam: Poydevor",
    basicsSubtitle: "Ega (Kim) va Fe'l (Harakat) orasidagi tobelikni o'rganish.",
    whatIsSentence: "Gap mantiqi",
    sentenceExplanation: "Gap — bu jamoa kabidir. Ega — bu kapitan, Fe'l — harakat. Ular kelishishi shart!",
    subject: "1. Ega (Subject)",
    subjectDesc: "Gapning qahramoni/boshlig'i. Harakatni kim bajaryapti? (Men, Sen, U, Tom)",
    verb: "2. Fe'l (Verb)",
    verbDesc: "Harakat. U Egaga qarab shaklini o'zgartiradi. (Go vs Goes)",
    object: "3. To'ldiruvchi (Object)",
    objectDesc: "Harakat kimga/nimaga yo'naltirilgan? (Ingliz tili, Olma, Maktab)",
    formula: "S + V + O Formulalari",
    agreement: "Ega va Fe'l moslashuvi (Tobelik)",
    agreementDesc: "Agar Ega birlikda (He/She/It) bo'lsa, Fe'l shakli o'zgaradi!",
    switchLang: "English",
    timeline: "Vaqt chizig'i",
    structureTable: "Formula xaritasi",
    positive: "Tasdiq (+)",
    negative: "Inkor (-)",
    question: "So'roq (?)",
    shortAnswers: "Qisqa javoblar",
    examples: "Eng yaxshi misollar",
    examplesSub: "Ega va Fe'l bog'liqligini ko'ring.",
    mistakes: "Ehtiyot bo'ling!",
    mistakesSub: "Ushbu zamonda ko'p qilinadigan xatolar.",
    finalTask: "Global Imtihon",
    finalTaskPrompt: "Aralash zamonlar yordamida hikoya yozing (120-180 so'z).",
    startJourney: "Boshlash",
    level: "Daraja",
    important: "Ustoz Maslahati:",
    comparison: "Taqqoslash",
    comparisonSub: "Nozik farqlar.",
    vocabTitle: "Lug'at",
    vocabSubtitle: "Gaplaringiz uchun g'ishtlar.",
    writingVocab: "Yozuv qurollari",
    searchVocab: "Qidirish...",
    wordInfo: "Tahlil",
    hideTranslation: "Yopish",
    showTranslation: "Ko'rsatish",
    visualExample: "To'liq vizual misol",
    who: "Who?",
    doWhat: "Do what?",
    what: "What?",
    svoHeading: "Asosiy gap tuzilishi: S + V + O",
    svoSub: "Asosiy gap tuzilishi: Ega + Fe'l + To'ldiruvchi (S + V + O)",
    whatIsTense: "Zamon nima?",
    tenseExplanation: "Zamon — harakat QACHON sodir bo'lganini bildiradi.",
    pastLabel: "O'tgan",
    presentLabel: "Hozirgi",
    futureLabel: "Kelasi",
    alreadyHappened: "Tugagan harakat",
    happeningNow: "Hozir bo'lyapti",
    willHappenLater: "Keyin bo'ladi",
    actionFinished: "Harakat tugadi",
    actionCurrent: "Harakat hozirgi",
    actionPlanned: "Harakat rejalangan",
    aboutPlatform: "Platforma haqida",
    platformPurpose: "Ushbu sayt nimani o'rgatadi?",
    platformDesc: "TenseGenius - bu sun'iy intellektga asoslangan platforma.",
    aboutDev: "Dasturchi haqida",
    devBio: "Sodiqjon Mukhtorov - intellektual ta'lim vositalarini yaratishga qiziqqan yosh web-dasturchi.",
    telegramProfile: "Telegram profil",
    login: "Kirish",
    register: "Ro'yxatdan o'tish",
    fullName: "Foydalanuvchi ismi",
    username: "Foydalanuvchi nomi",
    phone: "Telefon raqam",
    password: "Parol",
    confirmPassword: "Parolni tasdiqlang",
    forgotPassword: "Parolni unutdingizmi?",
    resetPassword: "Parolni tiklash",
    loginBtn: "Kirish",
    registerBtn: "Ro'yxatdan o'tish",
    confirmed: "Tasdiqlandi!",
    logout: "Leave",
    userCode: "Sizning ID kodingiz",
    adminPanel: "Admin Panel",
    giftXp: "XP yuborish",
    enterCode: "Foydalanuvchi kodi",
    amount: "XP miqdori",
    send: "Yuborish",
    usersList: "Foydalanuvchilar ro'yxati"
  }
};

export const SVO_EXAMPLES = [
  { s: "She", v: "drinks", o: "water", full: "She drinks water." },
  { s: "We", v: "play", o: "football", full: "We play football." },
  { s: "The cat", v: "catches", o: "mice", full: "The cat catches mice." },
  { s: "They", v: "watch", o: "movies", full: "They watch movies." }
];

export const LEVELS = [
  { id: 1, name: "Level 1 – Beginner Tenses", tenses: ['pres-simple', 'pres-cont', 'past-simple', 'future-simple'] },
  { id: 2, name: "Level 2 – Intermediate Flow", tenses: ['pres-perf', 'pres-perf-cont', 'past-cont', 'future-cont'] },
  { id: 3, name: "Level 3 – Advanced Completion", tenses: ['past-perf', 'past-perf-cont', 'future-perf', 'future-perf-cont'] },
  { id: 4, name: "Level 4 – Expert Perspectives", tenses: ['fitp-simple', 'fitp-cont', 'fitp-perf', 'fitp-perf-cont'] },
];

export const TENSES_DATA: TenseData[] = [
  {
    id: 'pres-simple',
    levelId: 1,
    colorTheme: 'present',
    name: { en: "Present Simple", uz: "Oddiy hozirgi zamon" },
    description: { en: "Daily routines and general facts.", uz: "Kundalik odatlar va umumiy faktlar." },
    detailedExplanation: { en: "Used for things that happen regularly.", uz: "Muntazam sodir bo'ladigan ishlar uchun." },
    timeline: "Repeated actions (Every day, always).",
    whenToUse: { en: ["Habits", "Facts"], uz: ["Odatlar", "Faktlar"] },
    signalWords: ["always", "usually", "often"],
    commonMistakes: [{ wrong: "He play", correct: "He plays", note: { en: "Add 's' for he/she/it.", uz: "He/she/it uchun 's' qo'shing." } }],
    structure: {
      positive: { rows: [{ subject: "I/You/We/They", verb: "play", example: "I play" }, { subject: "He/She/It", verb: "plays", example: "He plays" }], formula: "S + V(s/es)" },
      negative: { rows: [{ subject: "He", helper: "doesn't", verb: "play", example: "He doesn't play" }], formula: "S + don't/doesn't + V" },
      question: { rows: [{ helper: "Does", subject: "she", verb: "play?", example: "Does she play?" }], formula: "Do/Does + S + V?" },
      shortAnswers: "Yes, I do / No, she doesn't"
    },
    examples: [
      { sentence: "I **drink** coffee every morning.", translation: "Men har tong qahva ichaman.", type: 'positive', note: { en: "Habit", uz: "Odat" } },
      { sentence: "He **doesn't like** apples.", translation: "U olmalarni yoqtirmaydi.", type: 'negative', note: { en: "Dislike", uz: "Yoqtirmaslik" } },
      { sentence: "**Do** you **play** football?", translation: "Siz futbol o'ynaysizmi?", type: 'question', note: { en: "Question", uz: "So'roq" } }
    ],
    practice: [
      { type: 'writing', question: "He ____ (work) in a bank.", answer: "works", hint: { en: "3rd person singular.", uz: "Uchinchi shaxs birlik." } },
      { type: 'choice', question: "They ____ football every Sunday.", answer: "play", options: ["play", "plays", "playing"], hint: { en: "Plural subject.", uz: "Ega ko'plikda." } },
      { type: 'writing', question: "I ____ (not/like) apples.", answer: "don't like", hint: { en: "Negative form for 'I'.", uz: "'I' uchun inkor shakli." } },
      { type: 'choice', question: "____ she speak English?", answer: "Does", options: ["Do", "Does", "Is"], hint: { en: "Helper for 'she'.", uz: "'She' uchun yordamchi fe'l." } },
      { type: 'writing', question: "The sun ____ (rise) in the east.", answer: "rises", hint: { en: "General fact.", uz: "Umumiy fakt." } },
      { type: 'choice', question: "We ____ to the gym usually.", answer: "go", options: ["go", "goes", "going"], hint: { en: "First person plural.", uz: "Birinchi shaxs ko'plik." } },
      { type: 'writing', question: "My father ____ (wash) his car every week.", answer: "washes", hint: { en: "Add -es after -sh.", uz: "-sh dan keyin -es qo'shiladi." } },
      { type: 'choice', question: "Cats ____ milk.", answer: "like", options: ["like", "likes", "liking"], hint: { en: "Plural animals.", uz: "Hayvonlar ko'plikda." } },
      { type: 'writing', question: "Where ____ you live?", answer: "do", hint: { en: "Question helper.", uz: "So'roq yordamchisi." } },
      { type: 'choice', question: "It ____ a lot in winter.", answer: "rains", options: ["rain", "rains", "raining"], hint: { en: "Third person singular.", uz: "Uchinchi shaxs birlik." } }
    ]
  },
  {
    id: 'pres-cont',
    levelId: 1,
    colorTheme: 'continuous',
    name: { en: "Present Continuous", uz: "Hozirgi davomli zamon" },
    description: { en: "Actions happening right now.", uz: "Ayni damda sodir bo'layotgan harakatlar." },
    detailedExplanation: { en: "Use am/is/are + verb-ing.", uz: "Hozir bo'layotgan ishlar uchun am/is/are + fe'l-ing ishlating." },
    timeline: "In progress now.",
    whenToUse: { en: ["Now"], uz: ["Hozir"] },
    signalWords: ["now", "at the moment"],
    commonMistakes: [{ wrong: "I playing", correct: "I am playing", note: { en: "Missing helper.", uz: "Yordamchi fe'l yo'q." } }],
    structure: {
      positive: { rows: [{ subject: "I", verb: "am playing", example: "I am playing" }], formula: "S + am/is/are + V-ing" },
      negative: { rows: [{ subject: "I", helper: "am not", verb: "playing", example: "I'm not playing" }], formula: "S + am/is/are + not + V-ing" },
      question: { rows: [{ helper: "Are", subject: "you", verb: "playing?", example: "Are you playing?" }], formula: "Am/Is/Are + S + V-ing?" },
      shortAnswers: "Yes, I am / No, we aren't"
    },
    examples: [
      { sentence: "I **am studying** English now.", translation: "Men hozir ingliz tili o'qiyapman.", type: 'positive', note: { en: "Current action", uz: "Hozirgi harakat" } },
      { sentence: "They **are not watching** TV.", translation: "Ular televizor ko'rishmayapti.", type: 'negative', note: { en: "Negative", uz: "Inkor" } },
      { sentence: "**Is** it **raining** outside?", translation: "Tashqarida yomg'ir yog'yaptimi?", type: 'question', note: { en: "Question", uz: "So'roq" } }
    ],
    practice: [
      { type: 'writing', question: "They ____ (listen) to music now.", answer: "are listening", hint: { en: "Plural subject.", uz: "Ko'plikdagi ega." } },
      { type: 'choice', question: "Look! The cat ____ on the tree.", answer: "is climbing", options: ["is climbing", "climbs", "climb"], hint: { en: "Action in progress.", uz: "Hozirgi harakat." } },
      { type: 'writing', question: "I ____ (study) for my exam at the moment.", answer: "am studying", hint: { en: "Helper for 'I'.", uz: "'I' uchun yordamchi." } },
      { type: 'choice', question: "____ you watching TV?", answer: "Are", options: ["Is", "Am", "Are"], hint: { en: "Helper for 'you'.", uz: "'You' uchun yordamchi." } },
      { type: 'writing', question: "She ____ (not/wear) a hat today.", answer: "is not wearing", hint: { en: "Negative continuous.", uz: "Davomli inkor." } },
      { type: 'choice', question: "We ____ dinner right now.", answer: "are having", options: ["have", "having", "are having"], hint: { en: "We + helper + ing.", uz: "We + yordamchi + ing." } },
      { type: 'writing', question: "Who ____ (sing) downstairs?", answer: "is singing", hint: { en: "Singular person.", uz: "Birlikdagi shaxs." } },
      { type: 'choice', question: "Wait! I ____ my shoes.", answer: "am putting on", options: ["put on", "am putting on", "is putting on"], hint: { en: "Current action.", uz: "Hozirgi harakat." } },
      { type: 'writing', question: "The children ____ (play) in the garden.", answer: "are playing", hint: { en: "Children (plural).", uz: "Bolalar (ko'plik)." } },
      { type: 'choice', question: "Listen! Somebody ____ the door.", answer: "is knocking", options: ["knocks", "is knocking", "knocking"], hint: { en: "Present progress.", uz: "Hozirgi davomiylik." } }
    ]
  },
  {
    id: 'past-simple',
    levelId: 1,
    colorTheme: 'past',
    name: { en: "Past Simple", uz: "Oddiy o'tgan zamon" },
    description: { en: "Finished actions in the past.", uz: "O'tmishda tugagan harakatlar." },
    detailedExplanation: { en: "Fe'lning 2-shakli (V2) yoki -ed qo'shimchasi ishlatiladi.", uz: "O'tmishda tugallangan harakatlar uchun ishlatiladi." },
    timeline: "Action finished yesterday.",
    whenToUse: { en: ["Completed tasks"], uz: ["Tugallangan ishlar"] },
    signalWords: ["yesterday", "ago", "last week"],
    commonMistakes: [{ wrong: "Did you went?", correct: "Did you go?", note: { en: "After 'did', use base verb.", uz: "'did'dan keyin asosiy fe'lni ishlating." } }],
    structure: {
      positive: { rows: [{ subject: "I/You/We/They", verb: "went", example: "I went" }, { subject: "He/She/It", verb: "played", example: "He played" }], formula: "S + V2/ed" },
      negative: { rows: [{ subject: "I", helper: "didn't", verb: "go", example: "I didn't go" }], formula: "S + didn't + V" },
      question: { rows: [{ helper: "Did", subject: "you", verb: "go?", example: "Did you go?" }], formula: "Did + S + V?" },
      shortAnswers: "Yes, I did / No, I didn't"
    },
    examples: [
      { sentence: "We **visited** Samarkand last year.", translation: "O'tgan yili Samarqandga bordik.", type: 'positive', note: { en: "Finished action", uz: "Tugagan ish" } },
      { sentence: "I **didn't see** him yesterday.", translation: "Kecha uni ko'rmadim.", type: 'negative', note: { en: "Negative", uz: "Inkor" } },
      { sentence: "**Did** you **call** me?", translation: "Menga qo'ng'iroq qildingmi?", type: 'question', note: { en: "Question", uz: "So'roq" } }
    ],
    practice: [
      { type: 'writing', question: "I ____ (see) a movie yesterday.", answer: "saw", hint: { en: "Irregular verb.", uz: "Noto'g'ri fe'l." } },
      { type: 'choice', question: "They ____ to London last month.", answer: "went", options: ["go", "goes", "went"], hint: { en: "Past of 'go'.", uz: "'Go' ning o'tgan shakli." } },
      { type: 'writing', question: "She ____ (not/visit) her aunt last week.", answer: "didn't visit", hint: { en: "Negative past.", uz: "O'tgan inkor." } },
      { type: 'choice', question: "____ you call me an hour ago?", answer: "Did", options: ["Do", "Does", "Did"], hint: { en: "Past helper.", uz: "O'tgan yordamchi." } },
      { type: 'writing', question: "We ____ (play) tennis two days ago.", answer: "played", hint: { en: "Regular verb.", uz: "To'g'ri fe'l." } }
    ]
  },
  {
    id: 'future-simple',
    levelId: 1,
    colorTheme: 'future',
    name: { en: "Future Simple", uz: "Oddiy kelasi zamon" },
    description: { en: "Predictions and sudden decisions.", uz: "Kelajak bashoratlari va to'satdan qarorlar." },
    detailedExplanation: { en: "Use 'will' + base verb.", uz: "Kelajakdagi ishlar uchun oddiy 'will' + fe'l." },
    timeline: "Action in the future.",
    whenToUse: { en: ["Predictions", "Promises"], uz: ["Bashoratlar", "Va'dalar"] },
    signalWords: ["tomorrow", "soon", "next year"],
    commonMistakes: [{ wrong: "I will to go", correct: "I will go", note: { en: "No 'to' after will.", uz: "Willdan keyin 'to' yo'q." } }],
    structure: {
      positive: { rows: [{ subject: "All", verb: "will go", example: "I will go" }], formula: "S + will + V" },
      negative: { rows: [{ subject: "All", helper: "won't", verb: "go", example: "I won't go" }], formula: "S + won't + V" },
      question: { rows: [{ helper: "Will", subject: "you", verb: "go?", example: "Will you go?" }], formula: "Will + S + V?" },
      shortAnswers: "Yes, I will / No, I won't"
    },
    examples: [
      { sentence: "I **will call** you later.", translation: "Sizga keyinroq qo'ng'iroq qilaman.", type: 'positive', note: { en: "Promise", uz: "Va'da" } },
      { sentence: "It **won't rain** tomorrow.", translation: "Ertaga yomg'ir yog'maydi.", type: 'negative', note: { en: "Prediction", uz: "Bashorat" } },
      { sentence: "**Will** you **help** me?", translation: "Menga yordam berasizmi?", type: 'question', note: { en: "Offer/Question", uz: "Taklif/So'roq" } }
    ],
    practice: [
      { type: 'writing', question: "It ____ (rain) tomorrow.", answer: "will rain", hint: { en: "Future prediction.", uz: "Kelajak bashorati." } },
      { type: 'choice', question: "I think they ____ the match.", answer: "will win", options: ["win", "wins", "will win"], hint: { en: "Prediction.", uz: "Bashorat." } }
    ]
  },
  {
    id: 'pres-perf',
    levelId: 2,
    colorTheme: 'perfect',
    name: { en: "Present Perfect", uz: "Hozirgi tugallangan zamon" },
    description: { en: "Past actions with results now.", uz: "Hozirgi natijasi bor o'tgan harakatlar." },
    detailedExplanation: { en: "Have/Has + V3.", uz: "Have/Has + Fe'lning 3-shakli." },
    timeline: "Indefinite past.",
    whenToUse: { en: ["Experiences", "Recent actions"], uz: ["Tajribalar", "Yaqinda bo'lgan ishlar"] },
    signalWords: ["ever", "never", "yet", "already", "just"],
    commonMistakes: [{ wrong: "I have went", correct: "I have gone", note: { en: "Use V3.", uz: "V3 ishlating." } }],
    structure: {
      positive: { rows: [{ subject: "I/You/We/They", verb: "have gone", example: "I have gone" }, { subject: "He/She/It", verb: "has gone", example: "She has gone" }], formula: "S + have/has + V3" },
      negative: { rows: [{ subject: "She", helper: "hasn't", verb: "gone", example: "She hasn't gone" }], formula: "S + haven't/hasn't + V3" },
      question: { rows: [{ helper: "Have", subject: "you", verb: "gone?", example: "Have you gone?" }], formula: "Have/Has + S + V3?" },
      shortAnswers: "Yes, I have"
    },
    examples: [
      { sentence: "I **have seen** this movie.", translation: "Men bu kinoni ko'rganman.", type: 'positive', note: { en: "Experience", uz: "Tajriba" } },
      { sentence: "We **haven't eaten** yet.", translation: "Biz hali ovqatlanmadik.", type: 'negative', note: { en: "Not finished", uz: "Tugallanmagan" } },
      { sentence: "**Have** you ever **been** to London?", translation: "Hech Londonda bo'lganmisiz?", type: 'question', note: { en: "Experience question", uz: "Tajriba so'rog'i" } }
    ],
    practice: [
      { type: 'writing', question: "She ____ (lose) her keys.", answer: "has lost", hint: { en: "Recent result.", uz: "Yaqindagi natija." } }
    ]
  },
  {
    id: 'pres-perf-cont',
    levelId: 2,
    colorTheme: 'perfect',
    name: { en: "Present Perfect Continuous", uz: "Hozirgi tugallangan davomli" },
    description: { en: "Actions started in the past and still continuing.", uz: "O'tmishda boshlanib hali ham davom etayotgan ishlar." },
    detailedExplanation: { en: "Have/Has been + V-ing.", uz: "Have/Has been + been + fe'l-ing." },
    timeline: "Started in past, continuing now.",
    whenToUse: { en: ["Duration of action"], uz: ["Harakatning davomiyligi"] },
    signalWords: ["for", "since", "all day"],
    commonMistakes: [{ wrong: "I have being", correct: "I have been", note: { en: "Use 'been'.", uz: "'been' ishlating." } }],
    structure: {
      positive: { rows: [{ subject: "I", verb: "have been playing", example: "I have been playing" }], formula: "S + have/has + been + V-ing" },
      negative: { rows: [{ subject: "He", helper: "hasn't been", verb: "playing", example: "He hasn't been playing" }], formula: "S + hasn't + been + V-ing" },
      question: { rows: [{ helper: "How long", subject: "have you", verb: "been playing?", example: "How long have you been playing?" }], formula: "How long + have/has + S + been + V-ing?" },
      shortAnswers: "Yes, I have"
    },
    examples: [
      { sentence: "I **have been waiting** for an hour.", translation: "Men bir soatdan beri kutyapman.", type: 'positive', note: { en: "Duration", uz: "Davomiylik" } },
      { sentence: "It **hasn't been raining** since morning.", translation: "Ertalabdan beri yomg'ir yog'mayapti.", type: 'negative', note: { en: "Negative", uz: "Inkor" } },
      { sentence: "**Have** you **been studying** all day?", translation: "Kun bo'yi dars qilyapsizmi?", type: 'question', note: { en: "Question", uz: "So'roq" } }
    ],
    practice: [
      { type: 'writing', question: "It ____ ____ ____ (rain) all day.", answer: "has been raining", hint: { en: "Continuous duration.", uz: "Davomiy vaqt." } }
    ]
  },
  {
    id: 'past-cont',
    levelId: 2,
    colorTheme: 'continuous',
    name: { en: "Past Continuous", uz: "O'tgan davomli zamon" },
    description: { en: "Actions in progress in the past.", uz: "O'tmishda ma'lum bir vaqtda davom etayotgan harakatlar." },
    detailedExplanation: { en: "Was/Were + V-ing.", uz: "O'tmishdagi ma'lum bir nuqtada davom etgan harakatlar." },
    timeline: "Ongoing past action.",
    whenToUse: { en: ["Interrupted actions", "Background story"], uz: ["Bo'lingan harakatlar", "Hikoya foni"] },
    signalWords: ["while", "when", "at that time"],
    commonMistakes: [{ wrong: "They was", correct: "They were", note: { en: "Use were for they.", uz: "They uchun were ishlating." } }],
    structure: {
      positive: { rows: [{ subject: "I/He/She/It", verb: "was playing", example: "I was playing" }, { subject: "You/We/They", verb: "were playing", example: "We were playing" }], formula: "S + was/were + V-ing" },
      negative: { rows: [{ subject: "You", helper: "weren't", verb: "playing", example: "You weren't playing" }], formula: "S + wasn't/weren't + V-ing" },
      question: { rows: [{ helper: "Were", subject: "you", verb: "sleeping?", example: "Were you sleeping?" }], formula: "Was/Were + S + V-ing?" },
      shortAnswers: "Yes, I was"
    },
    examples: [
      { sentence: "I **was reading** when you called.", translation: "Siz qo'ng'iroq qilganingizda men o'qiyotgan edim.", type: 'positive', note: { en: "Interrupted action", uz: "Bo'lingan harakat" } },
      { sentence: "They **were not working** at 5 PM.", translation: "Soat 5 da ular ishlashmayotgan edi.", type: 'negative', note: { en: "Negative", uz: "Inkor" } },
      { sentence: "**Was** she **crying** when you saw her?", translation: "Uni ko'rganingizda u yig'layotgan edimi?", type: 'question', note: { en: "Question", uz: "So'roq" } }
    ],
    practice: [
      { type: 'writing', question: "What ____ you ____ (do) at 8 PM?", answer: "were... doing", hint: { en: "Past progress.", uz: "O'tgan davomiylik." } }
    ]
  },
  {
    id: 'future-cont',
    levelId: 2,
    colorTheme: 'continuous',
    name: { en: "Future Continuous", uz: "Kelasi davomli zamon" },
    description: { en: "Actions in progress in the future.", uz: "Kelajakda ma'lum bir vaqtda davom etayotgan bo'ladigan harakatlar." },
    detailedExplanation: { en: "Will be + V-ing.", uz: "Kelajakdagi ma'lum bir nuqtadagi davomiylik." },
    timeline: "Future progress.",
    whenToUse: { en: ["Specific future time"], uz: ["Aniq kelajak vaqti"] },
    signalWords: ["at this time tomorrow", "tomorrow morning"],
    commonMistakes: [{ wrong: "I will working", correct: "I will be working", note: { en: "Need be.", uz: "be kerak." } }],
    structure: {
      positive: { rows: [{ subject: "All", verb: "will be flying", example: "I will be flying" }], formula: "S + will be + V-ing" },
      negative: { rows: [{ subject: "All", helper: "won't be", verb: "sleeping", example: "I won't be sleeping" }], formula: "S + won't be + V-ing" },
      question: { rows: [{ helper: "Will", subject: "you", verb: "be working?", example: "Will you be working?" }], formula: "Will + S + be + V-ing?" },
      shortAnswers: "Yes, I will"
    },
    examples: [
      { sentence: "I **will be lying** on the beach tomorrow.", translation: "Ertaga plyajda yotgan bo'laman.", type: 'positive', note: { en: "Future moment", uz: "Kelajakdagi lahza" } },
      { sentence: "She **won't be sleeping** at 10 PM.", translation: "Soat 10 da u uxlamayotgan bo'ladi.", type: 'negative', note: { en: "Negative", uz: "Inkor" } },
      { sentence: "**Will** you **be using** the car later?", translation: "Keyinroq mashinadan foydalanasizmi?", type: 'question', note: { en: "Polite question", uz: "Xushmuomala so'roq" } }
    ],
    practice: [
      { type: 'writing', question: "I ____ ____ ____ (fly) to London tomorrow morning.", answer: "will be flying", hint: { en: "Ongoing future.", uz: "Davomli kelajak." } }
    ]
  },
  {
    id: 'past-perf',
    levelId: 3,
    colorTheme: 'perfect',
    name: { en: "Past Perfect", uz: "O'tgan tugallangan zamon" },
    description: { en: "Completed before another past action.", uz: "O'tmishdagi boshqa bir harakatdan oldin tugagan harakat." },
    detailedExplanation: { en: "Had + V3.", uz: "O'tmishdan oldingi o'tmish." },
    timeline: "Past of the past.",
    whenToUse: { en: ["Action sequence in past"], uz: ["O'tmishdagi harakatlar ketma-ketligi"] },
    signalWords: ["before", "by the time", "after", "already"],
    commonMistakes: [{ wrong: "I have had", correct: "I had had", note: { en: "Use had.", uz: "had ishlating." } }],
    structure: {
      positive: { rows: [{ subject: "All", verb: "had finished", example: "I had finished" }], formula: "S + had + V3" },
      negative: { rows: [{ subject: "All", helper: "hadn't", verb: "arrived", example: "I hadn't arrived" }], formula: "S + had not + V3" },
      question: { rows: [{ helper: "Had", subject: "you", verb: "eaten?", example: "Had you eaten?" }], formula: "Had + S + V3?" },
      shortAnswers: "Yes, I had"
    },
    examples: [
      { sentence: "When I arrived, the train **had left**.", translation: "Men kelganimda poyezd ketib bo'lgan edi.", type: 'positive', note: { en: "First action", uz: "Birinchi harakat" } },
      { sentence: "I **hadn't seen** him before today.", translation: "Bugungacha uni ko'rmagan edim.", type: 'negative', note: { en: "Negative", uz: "Inkor" } },
      { sentence: "**Had** you **finished** your work by 5?", translation: "Soat 5 gacha ishingizni tugatgan edingizmi?", type: 'question', note: { en: "Deadline question", uz: "Muddat so'rog'i" } }
    ],
    practice: [
      { type: 'writing', question: "She ____ (study) before the test.", answer: "had studied", hint: { en: "Prior action.", uz: "Oldingi harakat." } }
    ]
  },
  {
    id: 'past-perf-cont',
    levelId: 3,
    colorTheme: 'perfect',
    name: { en: "Past Perfect Continuous", uz: "O'tgan tugallangan davomli" },
    description: { en: "Ongoing action before another past point.", uz: "O'tmishdagi boshqa bir vaqtgacha davom etgan harakat." },
    detailedExplanation: { en: "Had been + V-ing.", uz: "O'tmishdagi davomiylik." },
    timeline: "Past duration.",
    whenToUse: { en: ["Cause of something in past"], uz: ["O'tmishdagi biror narsaning sababi"] },
    signalWords: ["for", "since", "all morning"],
    commonMistakes: [{ wrong: "He was been", correct: "He had been", note: { en: "Use had been.", uz: "had been ishlating." } }],
    structure: {
      positive: { rows: [{ subject: "All", verb: "had been playing", example: "I had been playing" }], formula: "S + had been + V-ing" },
      negative: { rows: [{ subject: "All", helper: "hadn't been", verb: "waiting", example: "I hadn't been waiting" }], formula: "S + hadn't been + V-ing" },
      question: { rows: [{ helper: "Had", subject: "you", verb: "been waiting?", example: "Had you been waiting?" }], formula: "Had + S + been + V-ing?" },
      shortAnswers: "Yes, I had"
    },
    examples: [
      { sentence: "He **had been working** hard for hours.", translation: "U soatlab qattiq ishlayotgan edi.", type: 'positive', note: { en: "Past duration", uz: "O'tgan davomiylik" } },
      { sentence: "We **hadn't been studying** long.", translation: "Biz uzoq dars qilmayotgan edik.", type: 'negative', note: { en: "Negative", uz: "Inkor" } },
      { sentence: "**Had** she **been crying** before you came?", translation: "Kelishingizdan oldin u yig'layotgan edimi?", type: 'question', note: { en: "Question", uz: "So'roq" } }
    ],
    practice: [
      { type: 'writing', question: "They ____ ____ ____ (wait) for an hour before the bus came.", answer: "had been waiting", hint: { en: "Long past action.", uz: "Uzoq o'tgan harakat." } }
    ]
  },
  {
    id: 'future-perf',
    levelId: 3,
    colorTheme: 'perfect',
    name: { en: "Future Perfect", uz: "Kelasi tugallangan zamon" },
    description: { en: "Completed by a future time.", uz: "Kelajakdagi ma'lum bir vaqtgacha tugallanadigan harakat." },
    detailedExplanation: { en: "Will have + V3.", uz: "Kelajakdagi ma'lum bir nuqtadagi natija." },
    timeline: "Future completion.",
    whenToUse: { en: ["Deadlines in future"], uz: ["Kelajakdagi muddatlar"] },
    signalWords: ["by next week", "by 2030", "by then"],
    commonMistakes: [{ wrong: "I will have finish", correct: "I will have finished", note: { en: "Use V3.", uz: "V3 ishlating." } }],
    structure: {
      positive: { rows: [{ subject: "All", verb: "will have graduated", example: "I will have graduated" }], formula: "S + will have + V3" },
      negative: { rows: [{ subject: "All", helper: "won't have", verb: "started", example: "I won't have started" }], formula: "S + won't have + V3" },
      question: { rows: [{ helper: "Will", subject: "you", verb: "have finished?", example: "Will you have finished?" }], formula: "Will + S + have + V3?" },
      shortAnswers: "Yes, I will"
    },
    examples: [
      { sentence: "By 2026, I **will have graduated**.", translation: "2026-yilgacha o'qishni bitirib bo'laman.", type: 'positive', note: { en: "Deadline", uz: "Muddat" } },
      { sentence: "They **won't have finished** by tomorrow.", translation: "Ertagacha ular tugatib bo'lishmaydi.", type: 'negative', note: { en: "Negative", uz: "Inkor" } },
      { sentence: "**Will** you **have arrived** by 6 PM?", translation: "Soat 6 gacha yetib kelasizmi?", type: 'question', note: { en: "Question", uz: "So'roq" } }
    ],
    practice: [
      { type: 'writing', question: "By 6 PM, we ____ ____ (eat) dinner.", answer: "will have eaten", hint: { en: "Finished by 6.", uz: "6gacha tugaydi." } }
    ]
  },
  {
    id: 'future-perf-cont',
    levelId: 3,
    colorTheme: 'perfect',
    name: { en: "Future Perfect Continuous", uz: "Kelasi tugallangan davomli" },
    description: { en: "Duration up to a future point.", uz: "Kelajakdagi bir vaqtgacha harakat qancha davom etgan bo'lishini ko'rsatadi." },
    detailedExplanation: { en: "Will have been + V-ing.", uz: "Kelajakdagi muddatgacha bo'lgan davomiylik." },
    timeline: "Future duration count.",
    whenToUse: { en: ["Counting duration to future"], uz: ["Kelajakdagi vaqtni hisoblash"] },
    signalWords: ["for 5 years", "for 10 months", "by then"],
    commonMistakes: [{ wrong: "I will have being", correct: "I will have been", note: { en: "Use been.", uz: "been ishlating." } }],
    structure: {
      positive: { rows: [{ subject: "All", verb: "will have been living", example: "I will have been living" }], formula: "S + will have been + V-ing" },
      negative: { rows: [{ subject: "All", helper: "won't have been", verb: "waiting", example: "I won't have been waiting" }], formula: "S + won't have been + V-ing" },
      question: { rows: [{ helper: "How long", subject: "will you", verb: "have been studying?", example: "How long will you have been studying?" }], formula: "How long + will + S + have + been + V-ing?" },
      shortAnswers: "Yes, I will"
    },
    examples: [
      { sentence: "I **will have been working** here for a year.", translation: "Keyinroq bu yerda ishlayotganimga bir yil bo'ladi.", type: 'positive', note: { en: "Count", uz: "Hisoblash" } },
      { sentence: "We **won't have been waiting** long.", translation: "Uzoq kutayotgan bo'lmaymiz.", type: 'negative', note: { en: "Negative", uz: "Inkor" } },
      { sentence: "**Will** you **have been playing** for 3 hours?", translation: "O'shanda 3 soatdan beri o'ynayotgan bo'lasizmi?", type: 'question', note: { en: "Question", uz: "So'roq" } }
    ],
    practice: [
      { type: 'writing', question: "Next month, she ____ ____ ____ ____ (live) here for two years.", answer: "will have been living", hint: { en: "Future duration count.", uz: "Kelajakdagi davomni hisoblash." } }
    ]
  },
  {
    id: 'fitp-simple',
    levelId: 4,
    colorTheme: 'future',
    name: { en: "Future-in-the-Past Simple", uz: "O'tgan kelasi zamon" },
    description: { en: "Future relative to the past.", uz: "O'tmish nuqtai nazaridan kelajak." },
    detailedExplanation: { en: "Would + V.", uz: "O'tmishdagi kelajak." },
    timeline: "Future relative to past point.",
    whenToUse: { en: ["Reported speech", "Conditional"], uz: ["O'zlashtirma gap", "Shart gap"] },
    signalWords: ["said that", "thought that", "promised that"],
    commonMistakes: [{ wrong: "I thought I will", correct: "I thought I would", note: { en: "Use would.", uz: "would ishlating." } }],
    structure: {
      positive: { rows: [{ subject: "All", verb: "would go", example: "I would go" }], formula: "S + would + V" },
      negative: { rows: [{ subject: "All", helper: "wouldn't", verb: "go", example: "I wouldn't go" }], formula: "S + wouldn't + V" },
      question: { rows: [{ helper: "Would", subject: "you", verb: "go?", example: "Would you go?" }], formula: "Would + S + V?" },
      shortAnswers: "Yes, I would"
    },
    examples: [
      { sentence: "I knew you **would help** me.", translation: "Menga yordam berishingizni bilgan edim.", type: 'positive', note: { en: "Prediction in past", uz: "O'tmishdagi bashorat" } },
      { sentence: "She said she **wouldn't come**.", translation: "U kelmasligini aytdi.", type: 'negative', note: { en: "Negative reported", uz: "O'zlashtirma inkor" } },
      { sentence: "**Would** you **marry** her, I wondered.", translation: "Unga uylanarmidingiz, deb o'yladim.", type: 'question', note: { en: "Question in past", uz: "O'tmishdagi so'roq" } }
    ],
    practice: [
      { type: 'writing', question: "She said she ____ (call) me.", answer: "would call", hint: { en: "Reported future.", uz: "O'zlashtirilgan kelajak." } }
    ]
  },
  {
    id: 'fitp-cont',
    levelId: 4,
    colorTheme: 'continuous',
    name: { en: "Future-in-the-Past Continuous", uz: "O'tgan kelasi davomli" },
    description: { en: "Future progress from past perspective.", uz: "O'tmishda turib kelajakda davom etishi tasavvur qilingan harakat." },
    detailedExplanation: { en: "Would be + V-ing.", uz: "O'tmishdagi kelajak davomiyligi." },
    timeline: "Past future progress.",
    whenToUse: { en: ["Past plans for progress"], uz: ["O'tmishdagi davomli rejalar"] },
    signalWords: ["thought", "hoped", "imagined"],
    commonMistakes: [{ wrong: "I said I will be", correct: "I said I would be", note: { en: "Use would be.", uz: "would be ishlating." } }],
    structure: {
      positive: { rows: [{ subject: "All", verb: "would be playing", example: "I would be playing" }], formula: "S + would be + V-ing" },
      negative: { rows: [{ subject: "All", helper: "wouldn't be", verb: "waiting", example: "I wouldn't be waiting" }], formula: "S + wouldn't + V-ing" },
      question: { rows: [{ helper: "Would", subject: "you", verb: "be staying?", example: "Would you be staying?" }], formula: "Would + S + be + V-ing?" },
      shortAnswers: "Yes, I would"
    },
    examples: [
      { sentence: "I thought I **would be working** now.", translation: "Hozir ishlayotgan bo'laman deb o'ylagan edim.", type: 'positive', note: { en: "Past plan", uz: "O'tmishdagi reja" } },
      { sentence: "They expected we **wouldn't be staying**.", translation: "Biz qolmasligimizni kutishgan edi.", type: 'negative', note: { en: "Negative", uz: "Inkor" } },
      { sentence: "**Would** she **be waiting** for us?", translation: "U bizni kutib turarmidi?", type: 'question', note: { en: "Question", uz: "So'roq" } }
    ],
    practice: [
      { type: 'writing', question: "He hoped they ____ ____ (wait) for him.", answer: "would be waiting", hint: { en: "Expected progress.", uz: "Kutilgan davomiylik." } }
    ]
  },
  {
    id: 'fitp-perf',
    levelId: 4,
    colorTheme: 'perfect',
    name: { en: "Future-in-the-Past Perfect", uz: "O'tgan kelasi tugallangan" },
    description: { en: "Completion imagined from the past point.", uz: "O'tmishda turib kelajakda tugallanishi tasavvur qilingan harakat." },
    detailedExplanation: { en: "Would have + V3.", uz: "O'tmishdagi kelajak natijasi." },
    timeline: "Past future completion.",
    whenToUse: { en: ["Expectations in past"], uz: ["O'tmishdagi kutuvlar"] },
    signalWords: ["expected", "assured"],
    commonMistakes: [{ wrong: "I thought I will have", correct: "I thought I would have", note: { en: "Need V3 (finished).", uz: "V3 shakli kerak." } }],
    structure: {
      positive: { rows: [{ subject: "All", verb: "would have finished", example: "I would have finished" }], formula: "S + would have + V3" },
      negative: { rows: [{ subject: "All", helper: "wouldn't have", verb: "started", example: "I wouldn't have started" }], formula: "S + wouldn't + V3" },
      question: { rows: [{ helper: "Would", subject: "you", verb: "have gone?", example: "Would you have gone?" }], formula: "Would + S + have + V3?" },
      shortAnswers: "Yes, I would"
    },
    examples: [
      { sentence: "He expected he **would have arrived** by now.", translation: "U hozirgacha yetib kelgan bo'lishini kutgan edi.", type: 'positive', note: { en: "Expectation", uz: "Kutuv" } },
      { sentence: "I knew they **wouldn't have finished**.", translation: "Ular tugata olmasligini bilardim.", type: 'negative', note: { en: "Negative", uz: "Inkor" } },
      { sentence: "**Would** you **have helped** him back then?", translation: "O'shanda unga yordam bergan bo'larmidingiz?", type: 'question', note: { en: "Conditional question", uz: "Shartli so'roq" } }
    ],
    practice: [
      { type: 'writing', question: "I knew she ____ ____ (see) it by noon.", answer: "would have seen", hint: { en: "Past future perfect.", uz: "O'tgan kelasi tugallangan." } }
    ]
  },
  {
    id: 'fitp-perf-cont',
    levelId: 4,
    colorTheme: 'perfect',
    name: { en: "Future-in-the-Past Perfect Continuous", uz: "O'tgan kelasi tugallangan davomli" },
    description: { en: "Duration imagined from a past viewpoint.", uz: "O'tmish nuqtai nazaridan kelajakda harakat qancha davom etgan bo'lishini bildiradi." },
    detailedExplanation: { en: "Would have been + V-ing.", uz: "O'tmishdagi kelajak davomiyligi hisobi." },
    timeline: "Counting duration.",
    whenToUse: { en: ["Past predictions of duration"], uz: ["O'tmishdagi davomiylik bashoratlari"] },
    signalWords: ["for years", "since", "all day long"],
    commonMistakes: [{ wrong: "He would having", correct: "He would have", note: { en: "Use have.", uz: "have ishlating." } }],
    structure: {
      positive: { rows: [{ subject: "All", verb: "would have been living", example: "I would have been living" }], formula: "S + would have been + V-ing" },
      negative: { rows: [{ subject: "All", helper: "wouldn't have been", verb: "waiting", example: "I wouldn't have been waiting" }], formula: "S + wouldn't have been + V-ing" },
      question: { rows: [{ helper: "How long", subject: "would he", verb: "have been working?", example: "How long would he have been working?" }], formula: "How long + would + S + have + been + V-ing?" },
      shortAnswers: "Yes, he would"
    },
    examples: [
      { sentence: "I knew I **would have been teaching** for 10 years.", translation: "O'shanda 10 yildan beri dars berayotgan bo'lishimni bilardim.", type: 'positive', note: { en: "Duration count", uz: "Vaqt hisobi" } },
      { sentence: "She said we **wouldn't have been waiting** long.", translation: "U uzoq kutayotgan bo'lmaymiz, degan edi.", type: 'negative', note: { en: "Negative", uz: "Inkor" } },
      { sentence: "**Would** they **have been playing** for 5 hours?", translation: "Ular 5 soatdan beri o'ynayotgan bo'larmidilar?", type: 'question', note: { en: "Question", uz: "So'roq" } }
    ],
    practice: [
      { type: 'writing', question: "I thought they ____ ____ ____ ____ (wait) for hours.", answer: "would have been waiting", hint: { en: "Past predicted duration.", uz: "O'tmishda bashorat qilingan davomiylik." } }
    ]
  }
];

export const VOCABULARY_DATA: VocabularyCategory[] = [
  {
    id: 'advanced',
    name: { en: "Fundamental Lexicon", uz: "Asosiy terminlar" },
    items: [
      { word: "Fundamental", translation: "Asosiy, tub", definition: { en: "Forming a necessary base or core", uz: "Zarur poydevorni tashkil etuvchi" }, example: "A fundamental change in approach is needed.", type: "adjective" },
      { word: "Consequence", translation: "Oqibat, natija", definition: { en: "A result or effect of an action", uz: "Harakatning natijasi" }, example: "Every action has a consequence.", type: "noun" },
      { word: "Persuade", translation: "Ishontirmoq, ko'ndirmoq", definition: { en: "To convince someone", uz: "Kimnidir ishontirish" }, example: "I tried to persuade him to stay.", type: "verb" },
      { word: "Significant", translation: "Muhim, sezilarli", definition: { en: "Great or important", uz: "Muhim yoki katta" }, example: "A significant difference.", type: "adjective" },
      { word: "Ambiguous", translation: "Mavhum, noaniq", definition: { en: "Open to more than one interpretation", uz: "Bir nechta ma'noga ega bo'lish" }, example: "The law is ambiguous.", type: "adjective" },
      { word: "Contradict", translation: "Ziddiyatga bormoq", definition: { en: "Deny the truth of a statement", uz: "Fikrga qarshi chiqish" }, example: "The evidence contradicts his story.", type: "verb" },
      { word: "Appropriate", translation: "Muvofiq, mos", definition: { en: "Suitable or proper", uz: "Muvofiq yoki loyiq" }, example: "Appropriate behavior.", type: "adjective" },
      { word: "Analyze", translation: "Tahlil qilmoq", definition: { en: "Examine methodically", uz: "Uslubiy ravishda o'rganib chiqish" }, example: "We need to analyze the data.", type: "verb" },
      { word: "Diverse", translation: "Turli-tuman, xilma-xil", definition: { en: "Showing a great deal of variety", uz: "Xilma-xillikni ko'rsatish" }, example: "A diverse population.", type: "adjective" },
      { word: "Implement", translation: "Amalga oshirmoq, joriy etmoq", definition: { en: "Put into effect", uz: "Amalga oshirish" }, example: "Implement the plan.", type: "verb" },
      { word: "Obvious", translation: "Ayon, yaqqol", definition: { en: "Easily perceived or understood", uz: "Oson tushuniladigan" }, example: "It's obvious that he's lying.", type: "adjective" },
      { word: "Relevant", translation: "Aloqador, dolzarb", definition: { en: "Closely connected or appropriate", uz: "Tegishli yoki dolzarb" }, example: "Relevant information.", type: "adjective" },
      { word: "Vague", translation: "Xira, noaniq", definition: { en: "Of uncertain or unclear character", uz: "Aniq bo'lmagan" }, example: "A vague answer.", type: "adjective" },
      { word: "Sufficient", translation: "Yetarli", definition: { en: "Enough; adequate", uz: "Yetarli" }, example: "Sufficient funds.", type: "adjective" },
      { word: "Emphasis", translation: "Urg'u, e'tibor", definition: { en: "Special importance or value", uz: "Maxsus ahamiyat" }, example: "Emphasis on quality.", type: "noun" },
      { word: "Constraint", translation: "Cheklov", definition: { en: "A limitation or restriction", uz: "Cheklov yoki to'siq" }, example: "Time constraints.", type: "noun" },
      { word: "Consistent", translation: "Barqaror, izchil", definition: { en: "Acting or done in the same way", uz: "Bir xil tarzda bajariladigan" }, example: "Consistent results.", type: "adjective" },
      { word: "Hypothesis", translation: "Faraz", definition: { en: "A proposed explanation", uz: "Taklif qilingan tushuntirish" }, example: "A scientific hypothesis.", type: "noun" },
      { word: "Interpret", translation: "Talqin qilmoq", definition: { en: "Explain the meaning of", uz: "Ma'nosini tushuntirish" }, example: "Interpret the text.", type: "verb" },
      { word: "Objective", translation: "Maqsad / Xolis", definition: { en: "A goal or unbiased", uz: "Maqsad yoki betaraf" }, example: "Our main objective.", type: "noun/adjective" }
    ]
  },
  {
    id: 'travel',
    name: { en: "Travel & Transport", uz: "Sayohat va Transport" },
    items: [
      { word: "Itinerary", translation: "Sayohat rejasi (marshrut)", definition: { en: "A planned route or journey", uz: "Rejalashtirilgan yo'nalish" }, example: "Check our itinerary.", type: "noun" },
      { word: "Destination", translation: "Manzil", definition: { en: "The place to which someone is going", uz: "Borilishi kerak bo'lgan joy" }, example: "Popular tourist destination.", type: "noun" },
      { word: "Accommodation", translation: "Turar joy", definition: { en: "A place to live or stay", uz: "Yashash yoki qolish joyi" }, example: "Hotel accommodation.", type: "noun" },
      { word: "Commute", translation: "Ishga borib kelish", definition: { en: "Travel some distance to work", uz: "Ishga borib-kelish safari" }, example: "A long daily commute.", type: "verb/noun" },
      { word: "Departure", translation: "Jo'nab ketish", definition: { en: "The action of leaving", uz: "Ketish harakati" }, example: "Departure time.", type: "noun" },
      { word: "Congestion", translation: "Tirbandlik", definition: { en: "State of being blocked with traffic", uz: "Tirband bo'lish holati" }, example: "Traffic congestion.", type: "noun" },
      { word: "Excursion", translation: "Ekskursiya, sayr", definition: { en: "A short journey or trip", uz: "Qisqa sayohat" }, example: "Day excursion.", type: "noun" },
      { word: "Inconvenience", translation: "Noqulaylik", definition: { en: "Trouble or difficulty", uz: "Qiyinchilik yoki tashvish" }, example: "Sorry for the inconvenience.", type: "noun" },
      { word: "Scenic", translation: "Manzarali, go'zal", definition: { en: "Providing views of beautiful scenery", uz: "Go'zal manzarali" }, example: "The scenic route.", type: "adjective" },
      { word: "Hospitality", translation: "Mehmondo'stlik", definition: { en: "The friendly reception of guests", uz: "Mehmonlarga bo'lgan iliq munosabat" }, example: "Uzbek hospitality.", type: "noun" },
      { word: "Transit", translation: "Tranzit", definition: { en: "The carrying of people or goods", uz: "Yuk yoki odamlarni tashish" }, example: "In transit.", type: "noun" },
      { word: "Voyage", translation: "Sayohat (dengiz/kosmik)", definition: { en: "A long journey by sea or space", uz: "Dengiz orqali uzoq sayohat" }, example: "A long voyage.", type: "noun" },
      { word: "Expedition", translation: "Ekspeditsiya", definition: { en: "A journey for a purpose", uz: "Maqsadli sayohat" }, example: "Scientific expedition.", type: "noun" },
      { word: "Embark", translation: "Chiqmoq, boshlamoq", definition: { en: "Go on board a ship or aircraft", uz: "Kema yoki samolyotga chiqish" }, example: "Embark on a new journey.", type: "verb" },
      { word: "Remote", translation: "Olis, chekka", definition: { en: "Far from main centers of population", uz: "Aholi yashash joyidan uzoq" }, example: "A remote village.", type: "adjective" }
    ]
  },
  {
    id: 'food',
    name: { en: "Food, Drinks & Health", uz: "Oziq-ovqat va Salomatlik" },
    items: [
      { word: "Cuisine", translation: "Milliy taomlar uslubi", definition: { en: "A style or method of cooking", uz: "Pishirish uslubi" }, example: "Italian cuisine.", type: "noun" },
      { word: "Nutritious", translation: "To'yimli, foydali", definition: { en: "Efficient as food; nourishing", uz: "Oziqlantiruvchi" }, example: "A nutritious meal.", type: "adjective" },
      { word: "Beverage", translation: "Ichimlik", definition: { en: "A drink other than water", uz: "Suvdan boshqa ichimlik" }, example: "Hot beverages.", type: "noun" },
      { word: "Digest", translation: "Hazm qilmoq", definition: { en: "Break down food in the stomach", uz: "Ovqatni hazm qilish" }, example: "Easy to digest.", type: "verb" },
      { word: "Ingredients", translation: "Tarkibiy qismlar", definition: { en: "Components of a mixture", uz: "Aralashma qismlari" }, example: "Fresh ingredients.", type: "noun" },
      { word: "Consumption", translation: "Iste'mol", definition: { en: "The action of using up a resource", uz: "Resursdan foydalanish" }, example: "Food consumption.", type: "noun" },
      { word: "Savoury", translation: "Mazali (shirin bo'lmagan)", definition: { en: "Salty or spicy rather than sweet", uz: "Sho'r yoki achchiq (shirin emas)" }, example: "Savoury snacks.", type: "adjective" },
      { word: "Appetite", translation: "Ishtaha", definition: { en: "A natural desire to eat food", uz: "Ovqatlanish istagi" }, example: "A healthy appetite.", type: "noun" },
      { word: "Preservative", translation: "Konservant", definition: { en: "Substance used to preserve food", uz: "Saqlovchi modda" }, example: "No artificial preservatives.", type: "noun" },
      { word: "Organic", translation: "Tabiiy, organik", definition: { en: "Produced without chemicals", uz: "Kimyoviy moddalarsiz tayyorlangan" }, example: "Organic vegetables.", type: "adjective" },
      { word: "Moderate", translation: "Me'yordagi", definition: { en: "Average in amount or intensity", uz: "O'rtacha, me'yorida" }, example: "Moderate exercise.", type: "adjective" },
      { word: "Sustainable", translation: "Barqaror (ekologik)", definition: { en: "Able to be maintained at a certain level", uz: "Tabiatga zarar yetkazmaydigan" }, example: "Sustainable farming.", type: "adjective" },
      { word: "Delicacy", translation: "Noyob taom", definition: { en: "A choice or expensive food", uz: "Noyob yoki qimmat ovqat" }, example: "A local delicacy.", type: "noun" },
      { word: "Wholesome", translation: "Foydali, sog'lom", definition: { en: "Conducive to physical well-being", uz: "Sog'liq uchun foydali" }, example: "Wholesome food.", type: "adjective" },
      { word: "Contaminate", translation: "Zaharlamoq, ifloslantirmoq", definition: { en: "Make something impure", uz: "Narsani zaharlash" }, example: "Contaminated water.", type: "verb" }
    ]
  },
  {
    id: 'nature',
    name: { en: "Nature & Environment", uz: "Tabiat va Atrof-muhit" },
    items: [
      { word: "Environment", translation: "Atrof-muhit", definition: { en: "The surroundings or conditions", uz: "Atrof-muhit" }, example: "Protect the environment.", type: "noun" },
      { word: "Biodiversity", translation: "Biologik xilma-xillik", definition: { en: "Variety of life in the world", uz: "Dunyodagi hayot xilma-xilligi" }, example: "Rich biodiversity.", type: "noun" },
      { word: "Conservation", translation: "Muhofaza qilish", definition: { en: "The action of conserving something", uz: "Saqlash harakati" }, example: "Nature conservation.", type: "noun" },
      { word: "Extinct", translation: "Qirilib ketgan", definition: { en: "No longer in existence", uz: "Mavjud bo'lmagan" }, example: "Extinct animals.", type: "adjective" },
      { word: "Habitat", translation: "Yashash muhiti", definition: { en: "The natural home of a creature", uz: "Tirik mavjudotning uyi" }, example: "Natural habitat.", type: "noun" },
      { word: "Endangered", translation: "Yo'qolib ketish arafasidagi", definition: { en: "At risk of extinction", uz: "Xavf ostida" }, example: "Endangered species.", type: "adjective" },
      { word: "Pollution", translation: "Ifloslanish", definition: { en: "Presence of harmful substances", uz: "Zararli moddalar mavjudligi" }, example: "Air pollution.", type: "noun" },
      { word: "Renewable", translation: "Qayta tiklanuvchi", definition: { en: "Not depleted when used", uz: "Tugamaydigan" }, example: "Renewable energy.", type: "adjective" },
      { word: "Wildlife", translation: "Yovvoyi tabiat", definition: { en: "Wild animals collectively", uz: "Yovvoyi hayvonlar to'plami" }, example: "Local wildlife.", type: "noun" },
      { word: "Ecosystem", translation: "Ekosistema", definition: { en: "A biological community", uz: "Biologik hamjamiyat" }, example: "Delicate ecosystem.", type: "noun" },
      { word: "Drought", translation: "Qurg'oqchilik", definition: { en: "A prolonged period of low rainfall", uz: "Uzoq qurg'oqchilik" }, example: "The drought lasted months.", type: "noun" },
      { word: "Catastrophe", translation: "Falokat", definition: { en: "An event causing great damage", uz: "Katta zarar yetkazuvchi voqea" }, example: "Natural catastrophe.", type: "noun" },
      { word: "Phenomenon", translation: "Hodisa", definition: { en: "A remarkable person or thing", uz: "Ajoyib narsa yoki hodisa" }, example: "Natural phenomenon.", type: "noun" },
      { word: "Magnificent", translation: "Hashamatli, haybatli", definition: { en: "Impressively beautiful or elaborate", uz: "Juda go'zal yoki haybatli" }, example: "Magnificent view.", type: "adjective" },
      { word: "Thrive", translation: "Gurkirab rivojlanmoq", definition: { en: "Grow or develop well", uz: "Yaxshi rivojlanish" }, example: "Plants thrive in the sun.", type: "verb" }
    ]
  },
  {
    id: 'people',
    name: { en: "People, Family & Society", uz: "Odamlar va Jamiyat" },
    items: [
      { word: "Ancestors", translation: "Ajdodlar", definition: { en: "Person from whom one is descended", uz: "Kishining ajdodlari" }, example: "Our ancestors lived here.", type: "noun" },
      { word: "Sibling", translation: "Tug'ishgan", definition: { en: "A brother or sister", uz: "Aka-uka yoki opa-singil" }, example: "Do you have siblings?", type: "noun" },
      { word: "Acquaintance", translation: "Tanish", definition: { en: "A person one knows slightly", uz: "Bir oz taniydigan kishi" }, example: "A casual acquaintance.", type: "noun" },
      { word: "Inherit", translation: "Meros qilib olmoq", definition: { en: "Receive as an heir", uz: "Merosxo'r sifatida olish" }, example: "Inherit a fortune.", type: "verb" },
      { word: "Generation", translation: "Avlod", definition: { en: "All the people born at one time", uz: "Bir vaqtda tug'ilgan odamlar" }, example: "The next generation.", type: "noun" },
      { word: "Nurture", translation: "Tarbiyalamoq", definition: { en: "Care for and encourage growth", uz: "G'amxo'rlik qilish va tarbiyalash" }, example: "Nurture a child.", type: "verb" },
      { word: "Conflict", translation: "Nizoli vaziyat", definition: { en: "A serious disagreement", uz: "Jiddiy kelishmovchilik" }, example: "A family conflict.", type: "noun" },
      { word: "Relationship", translation: "Munosabat", definition: { en: "The way people are connected", uz: "Bog'liqlik yo'li" }, example: "Strong relationship.", type: "noun" },
      { word: "Personality", translation: "Shaxsiyat", definition: { en: "The qualities of a person", uz: "Kishining xususiyatlari" }, example: "A great personality.", type: "noun" },
      { word: "Supportive", translation: "Qo'llab-quvvatlovchi", definition: { en: "Providing encouragement", uz: "Dalda beruvchi" }, example: "A supportive friend.", type: "adjective" },
      { word: "Reliable", translation: "Ishonchli", definition: { en: "Consistently good in quality", uz: "Sifatli va ishonarli" }, example: "A reliable car.", type: "adjective" },
      { word: "Empathy", translation: "Hamdardlik", definition: { en: "The ability to understand feelings", uz: "Tuyg'ularni tushunish qobiliyati" }, example: "Show empathy.", type: "noun" },
      { word: "Demographics", translation: "Demografiya", definition: { en: "Statistical data of population", uz: "Aholi soni va tarkibi ma'lumotlari" }, example: "Changing demographics.", type: "noun" },
      { word: "Hierarchy", translation: "Ierarxiya", definition: { en: "A system of ranking", uz: "Pog'onali tartib tizimi" }, example: "Social hierarchy.", type: "noun" },
      { word: "Community", translation: "Jamiyat, mahalla", definition: { en: "A group of people in a place", uz: "Bir joydagi odamlar guruhi" }, example: "Local community.", type: "noun" }
    ]
  },
  {
    id: 'education_work',
    name: { en: "Education & Work", uz: "Ta'lim va Ish" },
    items: [
      { word: "Curriculum", translation: "O'quv dasturi", definition: { en: "The subjects comprising a course", uz: "O'quv kursi mavzulari" }, example: "School curriculum.", type: "noun" },
      { word: "Academic", translation: "Ilmiy, akademik", definition: { en: "Relating to education and scholarship", uz: "Ta'limga oid" }, example: "Academic achievement.", type: "adjective" },
      { word: "Opportunity", translation: "Imkoniyat", definition: { en: "A set of circumstances for success", uz: "Muvaffaqiyat uchun imkon" }, example: "A great opportunity.", type: "noun" },
      { word: "Achievement", translation: "Yutuq", definition: { en: "A thing done successfully", uz: "Muvaffaqiyatli bajarilgan ish" }, example: "Lifetime achievement.", type: "noun" },
      { word: "Institution", translation: "Muassasa", definition: { en: "An organization for a purpose", uz: "Muayyan maqsadli tashkilot" }, example: "Educational institution.", type: "noun" },
      { word: "Scholarship", translation: "Grant, stipendiya", definition: { en: "Academic study or financial aid", uz: "Moliyaviy yordam yoki o'qish" }, example: "Win a scholarship.", type: "noun" },
      { word: "Enrol", translation: "Ro'yxatdan o'tmoq", definition: { en: "Officially join a course", uz: "Kursga rasman qo'shilish" }, example: "Enrol in a class.", type: "verb" },
      { word: "Assessment", translation: "Baholash", definition: { en: "The evaluation of something", uz: "Narsani baholash" }, example: "Risk assessment.", type: "noun" },
      { word: "Infrastructure", translation: "Infratuzilma", definition: { en: "Basic physical structures", uz: "Asosiy jismoniy tuzilmalar" }, example: "City infrastructure.", type: "noun" },
      { word: "Rural", translation: "Qishloqqa oid", definition: { en: "Relating to the countryside", uz: "Qishloq hududiga tegishli" }, example: "A rural area.", type: "adjective" },
      { word: "Urban", translation: "Shaharga oid", definition: { en: "Relating to a city or town", uz: "Shahar hududiga tegishli" }, example: "Urban development.", type: "adjective" },
      { word: "Employment", translation: "Bandlik", definition: { en: "The state of having paid work", uz: "Ish bilan ta'minlanganlik holati" }, example: "Full-time employment.", type: "noun" },
      { word: "Vocational", translation: "Kasb-hunarga oid", definition: { en: "Relating to occupation or skills", uz: "Kasbiy mahoratga oid" }, example: "Vocational training.", type: "adjective" },
      { word: "Knowledgeable", translation: "Bilimli", definition: { en: "Intelligent and well informed", uz: "Aqlli va xabardor" }, example: "A knowledgeable person.", type: "adjective" },
      { word: "Productive", translation: "Mahsuldor", definition: { en: "Producing or able to produce", uz: "Mahsulot beradigan" }, example: "A productive meeting.", type: "adjective" },
      { word: "Requirement", translation: "Talab", definition: { en: "A thing that is needed", uz: "Zarur bo'lgan narsa" }, example: "Basic requirement.", type: "noun" },
      { word: "Innovative", translation: "Yangilik kirituvchi", definition: { en: "Featuring new methods", uz: "Yangi usullarni qo'llovchi" }, example: "Innovative design.", type: "adjective" },
      { word: "Collaboration", translation: "Hamkorlik", definition: { en: "The action of working with someone", uz: "Kimdir bilan ishlash harakati" }, example: "Team collaboration.", type: "noun" },
      { word: "Facility", translation: "Sharoit, bino", definition: { en: "A place provided for a purpose", uz: "Muayyan maqsadli joy" }, example: "Research facility.", type: "noun" },
      { word: "Supervise", translation: "Nazorat qilmoq", definition: { en: "Observe and direct the work", uz: "Ishni kuzatish va yo'naltirish" }, example: "Supervise the staff.", type: "verb" },
      { word: "Sophisticated", translation: "Murakkab, zamonaviy", definition: { en: "Highly developed and complex", uz: "Yuqori darajada rivojlangan" }, example: "Sophisticated technology.", type: "adjective" }
    ]
  }
];
