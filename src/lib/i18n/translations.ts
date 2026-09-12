export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
];

export interface TranslationStrings {
  searchPrompt: string;
  verifiedEngine: string;
  categories: string;
  viewAllTools: string;
  finance: string;
  health: string;
  math: string;
  construction: string;
  everyday: string;
  converters: string;
  calculate: string;
  reset: string;
  copyLink: string;
  copied: string;
  print: string;
  reportIssue: string;
}

export const TRANSLATIONS: Record<string, TranslationStrings> = {
  en: {
    searchPrompt: 'Search 50+ tools...',
    verifiedEngine: 'Verified Math Engine',
    categories: 'Categories',
    viewAllTools: 'View All 50 Tools →',
    finance: 'Finance',
    health: 'Health',
    math: 'Math',
    construction: 'Construction',
    everyday: 'Everyday',
    converters: 'Converters',
    calculate: 'Calculate',
    reset: 'Reset',
    copyLink: 'Copy Link',
    copied: 'Copied!',
    print: 'Print',
    reportIssue: 'Feedback',
  },
  hi: {
    searchPrompt: '50+ कैलकुलेटर खोजें...',
    verifiedEngine: 'सत्यापित गणित इंजन',
    categories: 'श्रेणियाँ',
    viewAllTools: 'सभी 50 टूल्स देखें →',
    finance: 'वित्त',
    health: 'स्वास्थ्य',
    math: 'गणित',
    construction: 'निर्माण',
    everyday: 'दैनिक',
    converters: 'परिवर्तक',
    calculate: 'गणना करें',
    reset: 'रीसेट',
    copyLink: 'लिंक कॉपी करें',
    copied: 'कॉपी हो गया!',
    print: 'प्रिंट',
    reportIssue: 'प्रतिक्रिया',
  },
  es: {
    searchPrompt: 'Buscar más de 50 calculadoras...',
    verifiedEngine: 'Motor Matemático Verificado',
    categories: 'Categorías',
    viewAllTools: 'Ver las 50 herramientas →',
    finance: 'Finanzas',
    health: 'Salud',
    math: 'Matemáticas',
    construction: 'Construcción',
    everyday: 'Cotidiano',
    converters: 'Conversores',
    calculate: 'Calcular',
    reset: 'Restablecer',
    copyLink: 'Copiar enlace',
    copied: '¡Copiado!',
    print: 'Imprimir',
    reportIssue: 'Comentarios',
  },
  fr: {
    searchPrompt: 'Rechercher plus de 50 outils...',
    verifiedEngine: 'Moteur Mathématique Vérifié',
    categories: 'Catégories',
    viewAllTools: 'Voir les 50 outils →',
    finance: 'Finance',
    health: 'Santé',
    math: 'Maths',
    construction: 'Construction',
    everyday: 'Quotidien',
    converters: 'Convertisseurs',
    calculate: 'Calculer',
    reset: 'Réinitialiser',
    copyLink: 'Copier le lien',
    copied: 'Copié !',
    print: 'Imprimer',
    reportIssue: 'Retour',
  },
  de: {
    searchPrompt: 'Über 50 Rechner durchsuchen...',
    verifiedEngine: 'Verifizierte Mathe-Engine',
    categories: 'Kategorien',
    viewAllTools: 'Alle 50 Rechner anzeigen →',
    finance: 'Finanzen',
    health: 'Gesundheit',
    math: 'Mathematik',
    construction: 'Bauwesen',
    everyday: 'Alltag',
    converters: 'Umrechner',
    calculate: 'Berechnen',
    reset: 'Zurücksetzen',
    copyLink: 'Link kopieren',
    copied: 'Kopiert!',
    print: 'Drucken',
    reportIssue: 'Feedback',
  },
  ar: {
    searchPrompt: 'ابحث في أكثر من 50 آلة حاسبة...',
    verifiedEngine: 'محرك رياضي موثوق',
    categories: 'التصنيفات',
    viewAllTools: 'عرض جميع الأدوات الـ 50 ←',
    finance: 'المالية',
    health: 'الصحة',
    math: 'الرياضيات',
    construction: 'البناء',
    everyday: 'اليومي',
    converters: 'المحولات',
    calculate: 'احسب',
    reset: 'إعادة ضبط',
    copyLink: 'نسخ الرابط',
    copied: 'تم النسخ!',
    print: 'طباعة',
    reportIssue: 'ملاحظات',
  },
  pt: {
    searchPrompt: 'Pesquise mais de 50 calculadoras...',
    verifiedEngine: 'Motor Matemático Verificado',
    categories: 'Categorias',
    viewAllTools: 'Ver todas as 50 ferramentas →',
    finance: 'Finanças',
    health: 'Saúde',
    math: 'Matemática',
    construction: 'Construção',
    everyday: 'Cotidiano',
    converters: 'Conversores',
    calculate: 'Calcular',
    reset: 'Redefinir',
    copyLink: 'Copiar link',
    copied: 'Copiado!',
    print: 'Imprimir',
    reportIssue: 'Feedback',
  },
  zh: {
    searchPrompt: '搜索 50+ 个计算器...',
    verifiedEngine: '验证数学引擎',
    categories: '类别',
    viewAllTools: '查看全部 50 个工具 →',
    finance: '金融理财',
    health: '健康医疗',
    math: '数学计算',
    construction: '工程建筑',
    everyday: '日常生活',
    converters: '单位换算',
    calculate: '开始计算',
    reset: '重置',
    copyLink: '复制链接',
    copied: '已复制！',
    print: '打印报告',
    reportIssue: '意见反馈',
  },
  ja: {
    searchPrompt: '50以上の計算ツールを検索...',
    verifiedEngine: '検証済み計算エンジン',
    categories: 'カテゴリ',
    viewAllTools: '全50ツールを見る →',
    finance: '金融・ローン',
    health: '健康・フィットネス',
    math: '数学・代数',
    construction: '建築・DIY',
    everyday: '日常・生活',
    converters: '単位換算',
    calculate: '計算する',
    reset: 'リセット',
    copyLink: 'リンクをコピー',
    copied: 'コピーしました！',
    print: '印刷',
    reportIssue: 'フィードバック',
  },
};

export function getTranslation(lang: string = 'en'): TranslationStrings {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
