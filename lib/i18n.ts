// Multi-language support for Big Starz App
// Supported languages: English, Arabic, Hindi, Urdu, Swahili

export type Language = 'en' | 'es' | 'fr' | 'pt' | 'hi' | 'ar' | 'it' | 'de' | 'us' | 'sw';

export const LANGUAGES: Record<Language, string> = {
  en: 'English (UK)',
  es: 'Español',
  fr: 'Français',
  pt: 'Português',
  hi: 'हिन्दी',
  ar: 'العربية',
  it: 'Italiano',
  de: 'Deutsch',
  us: 'English (USA)',
  sw: 'Kiswahili',
};

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Tab Navigation
    'tab.vibe': 'Vibe',
    'tab.create': 'Create',
    'tab.chat': 'Chat',
    'tab.profile': 'Profile',
    'tab.wallet': 'Wallet',
    'tab.music': 'Music',

    // Vibe Screen
    'vibe.title': 'Vibe Feed',
    'vibe.likes': 'Likes',
    'vibe.comments': 'Comments',
    'vibe.share': 'Share',

    // Create Screen
    'create.title': 'AI Studio',
    'create.musicVideo': 'Music Video',
    'create.aiCameo': 'AI Cameo',
    'create.aiImage': 'AI Image',
    'create.prompt': 'Enter prompt...',
    'create.style': 'Style',
    'create.generate': 'Generate',
    'create.generating': 'Generating...',
    'create.quotaExceeded': 'Daily quota exceeded',
    'create.upgradeNow': 'Upgrade Now',

    // Chat Screen
    'chat.title': 'Chat',
    'chat.messages': 'Messages',
    'chat.friends': 'Friends',
    'chat.searchFriends': 'Search friends...',
    'chat.addFriend': 'Add Friend',
    'chat.typeMessage': 'Type message...',
    'chat.send': 'Send',
    'chat.online': 'Online',
    'chat.offline': 'Offline',

    // Profile Screen
    'profile.title': 'Profile',
    'profile.followers': 'Followers',
    'profile.views': 'Views',
    'profile.likes': 'Likes',
    'profile.follow': 'Follow',
    'profile.following': 'Following',
    'profile.message': 'Message',
    'profile.earnings': 'Earnings',
    'profile.withdraw': 'Withdraw',

    // Wallet Screen
    'wallet.title': 'Wallet',
    'wallet.balance': 'Balance',
    'wallet.transactions': 'Transactions',
    'wallet.currentTier': 'Current Tier',
    'wallet.upgrade': 'Upgrade',
    'wallet.free': 'Free',
    'wallet.pro': 'Pro',
    'wallet.elite': 'Elite',
    'wallet.perDay': 'per day',
    'wallet.perMonth': 'per month',
    'wallet.mostPopular': 'Most Popular',
    'wallet.unlimited': 'Unlimited',

    // Music Screen
    'music.title': 'Music Library',
    'music.beats': 'Beats',
    'music.useBeat': 'Use Beat',
    'music.downloads': 'Downloads',
    'music.bpm': 'BPM',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.about': 'About',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.back': 'Back',
  },
  ar: {
    // Tab Navigation
    'tab.vibe': 'الاهتزاز',
    'tab.create': 'إنشاء',
    'tab.chat': 'دردشة',
    'tab.profile': 'الملف الشخصي',
    'tab.wallet': 'المحفظة',
    'tab.music': 'الموسيقى',

    // Vibe Screen
    'vibe.title': 'تغذية الاهتزاز',
    'vibe.likes': 'الإعجابات',
    'vibe.comments': 'التعليقات',
    'vibe.share': 'مشاركة',

    // Create Screen
    'create.title': 'استوديو الذكاء الاصطناعي',
    'create.musicVideo': 'فيديو موسيقي',
    'create.aiCameo': 'كاميو الذكاء الاصطناعي',
    'create.aiImage': 'صورة الذكاء الاصطناعي',
    'create.prompt': 'أدخل الطلب...',
    'create.style': 'النمط',
    'create.generate': 'إنشاء',
    'create.generating': 'جاري الإنشاء...',
    'create.quotaExceeded': 'تم تجاوز الحد اليومي',
    'create.upgradeNow': 'ترقية الآن',

    // Chat Screen
    'chat.title': 'دردشة',
    'chat.messages': 'الرسائل',
    'chat.friends': 'الأصدقاء',
    'chat.searchFriends': 'البحث عن الأصدقاء...',
    'chat.addFriend': 'إضافة صديق',
    'chat.typeMessage': 'اكتب الرسالة...',
    'chat.send': 'إرسال',
    'chat.online': 'متصل',
    'chat.offline': 'غير متصل',

    // Profile Screen
    'profile.title': 'الملف الشخصي',
    'profile.followers': 'المتابعون',
    'profile.views': 'المشاهدات',
    'profile.likes': 'الإعجابات',
    'profile.follow': 'متابعة',
    'profile.following': 'متابع',
    'profile.message': 'رسالة',
    'profile.earnings': 'الأرباح',
    'profile.withdraw': 'سحب',

    // Wallet Screen
    'wallet.title': 'المحفظة',
    'wallet.balance': 'الرصيد',
    'wallet.transactions': 'المعاملات',
    'wallet.currentTier': 'المستوى الحالي',
    'wallet.upgrade': 'ترقية',
    'wallet.free': 'مجاني',
    'wallet.pro': 'احترافي',
    'wallet.elite': 'نخبة',
    'wallet.perDay': 'يومياً',
    'wallet.perMonth': 'شهرياً',
    'wallet.mostPopular': 'الأكثر شيوعاً',
    'wallet.unlimited': 'غير محدود',

    // Music Screen
    'music.title': 'مكتبة الموسيقى',
    'music.beats': 'الإيقاعات',
    'music.useBeat': 'استخدم الإيقاع',
    'music.downloads': 'التنزيلات',
    'music.bpm': 'نبضات في الدقيقة',

    // Settings
    'settings.title': 'الإعدادات',
    'settings.language': 'اللغة',
    'settings.theme': 'المظهر',
    'settings.notifications': 'الإخطارات',
    'settings.privacy': 'الخصوصية',
    'settings.about': 'حول',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تحرير',
    'common.back': 'رجوع',
  },
  hi: {
    // Tab Navigation
    'tab.vibe': 'वाइब',
    'tab.create': 'बनाएं',
    'tab.chat': 'चैट',
    'tab.profile': 'प्रोफ़ाइल',
    'tab.wallet': 'वॉलेट',
    'tab.music': 'संगीत',

    // Vibe Screen
    'vibe.title': 'वाइब फीड',
    'vibe.likes': 'पसंद',
    'vibe.comments': 'टिप्पणियां',
    'vibe.share': 'साझा करें',

    // Create Screen
    'create.title': 'AI स्टूडियो',
    'create.musicVideo': 'संगीत वीडियो',
    'create.aiCameo': 'AI कैमियो',
    'create.aiImage': 'AI छवि',
    'create.prompt': 'प्रॉम्प्ट दर्ज करें...',
    'create.style': 'शैली',
    'create.generate': 'बनाएं',
    'create.generating': 'बना रहे हैं...',
    'create.quotaExceeded': 'दैनिक कोटा अधिक हो गया',
    'create.upgradeNow': 'अभी अपग्रेड करें',

    // Chat Screen
    'chat.title': 'चैट',
    'chat.messages': 'संदेश',
    'chat.friends': 'दोस्त',
    'chat.searchFriends': 'दोस्तों को खोजें...',
    'chat.addFriend': 'दोस्त जोड़ें',
    'chat.typeMessage': 'संदेश लिखें...',
    'chat.send': 'भेजें',
    'chat.online': 'ऑनलाइन',
    'chat.offline': 'ऑफलाइन',

    // Profile Screen
    'profile.title': 'प्रोफ़ाइल',
    'profile.followers': 'अनुयायी',
    'profile.views': 'दृश्य',
    'profile.likes': 'पसंद',
    'profile.follow': 'अनुसरण करें',
    'profile.following': 'अनुसरण कर रहे हैं',
    'profile.message': 'संदेश',
    'profile.earnings': 'कमाई',
    'profile.withdraw': 'निकालें',

    // Wallet Screen
    'wallet.title': 'वॉलेट',
    'wallet.balance': 'शेष राशि',
    'wallet.transactions': 'लेनदेन',
    'wallet.currentTier': 'वर्तमान स्तर',
    'wallet.upgrade': 'अपग्रेड करें',
    'wallet.free': 'मुफ़्त',
    'wallet.pro': 'प्रो',
    'wallet.elite': 'एलीट',
    'wallet.perDay': 'प्रति दिन',
    'wallet.perMonth': 'प्रति माह',
    'wallet.mostPopular': 'सबसे लोकप्रिय',
    'wallet.unlimited': 'असीमित',

    // Music Screen
    'music.title': 'संगीत पुस्तकालय',
    'music.beats': 'बीट्स',
    'music.useBeat': 'बीट का उपयोग करें',
    'music.downloads': 'डाउनलोड',
    'music.bpm': 'BPM',

    // Settings
    'settings.title': 'सेटिंग्स',
    'settings.language': 'भाषा',
    'settings.theme': 'थीम',
    'settings.notifications': 'सूचनाएं',
    'settings.privacy': 'गोपनीयता',
    'settings.about': 'बारे में',

    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफल',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.back': 'वापस',
  },

  sw: {
    // Tab Navigation
    'tab.vibe': 'Vibe',
    'tab.create': 'Tengeneza',
    'tab.chat': 'Sumbua',
    'tab.profile': 'Wasifu',
    'tab.wallet': 'Mkoba',
    'tab.music': 'Muziki',

    // Vibe Screen
    'vibe.title': 'Vibe Feed',
    'vibe.likes': 'Kupenda',
    'vibe.comments': 'Maoni',
    'vibe.share': 'Shiriki',

    // Create Screen
    'create.title': 'AI Studio',
    'create.musicVideo': 'Video ya Muziki',
    'create.aiCameo': 'AI Cameo',
    'create.aiImage': 'Picha ya AI',
    'create.prompt': 'Ingiza agizo...',
    'create.style': 'Mtindo',
    'create.generate': 'Tengeneza',
    'create.generating': 'Inatengeza...',
    'create.quotaExceeded': 'Kiwango cha kila siku kimezidi',
    'create.upgradeNow': 'Boreseza Sasa',

    // Chat Screen
    'chat.title': 'Sumbua',
    'chat.messages': 'Ujumbe',
    'chat.friends': 'Marafiki',
    'chat.searchFriends': 'Tafuta marafiki...',
    'chat.addFriend': 'Ongeza Rafiki',
    'chat.typeMessage': 'Andika ujumbe...',
    'chat.send': 'Tuma',
    'chat.online': 'Mkondoni',
    'chat.offline': 'Nje ya mtandao',

    // Profile Screen
    'profile.title': 'Wasifu',
    'profile.followers': 'Wafuasi',
    'profile.views': 'Maonyo',
    'profile.likes': 'Kupenda',
    'profile.follow': 'Fuata',
    'profile.following': 'Inafuata',
    'profile.message': 'Ujumbe',
    'profile.earnings': 'Mapato',
    'profile.withdraw': 'Ondoa',

    // Wallet Screen
    'wallet.title': 'Mkoba',
    'wallet.balance': 'Salio',
    'wallet.transactions': 'Miamala',
    'wallet.currentTier': 'Kiwango Cha Sasa',
    'wallet.upgrade': 'Boreseza',
    'wallet.free': 'Bure',
    'wallet.pro': 'Pro',
    'wallet.elite': 'Elite',
    'wallet.perDay': 'kwa siku',
    'wallet.perMonth': 'kwa mwezi',
    'wallet.mostPopular': 'Maadhimisho Zaidi',
    'wallet.unlimited': 'Bila Kikomo',

    // Music Screen
    'music.title': 'Maktaba ya Muziki',
    'music.beats': 'Beats',
    'music.useBeat': 'Tumia Beat',
    'music.downloads': 'Mipakuzi',
    'music.bpm': 'BPM',

    // Settings
    'settings.title': 'Mipangilio',
    'settings.language': 'Lugha',
    'settings.theme': 'Mandhari',
    'settings.notifications': 'Arifa',
    'settings.privacy': 'Faragha',
    'settings.about': 'Kuhusu',

    // Common
    'common.loading': 'Inapakua...',
    'common.error': 'Hitilafu',
    'common.success': 'Imefaulu',
    'common.cancel': 'Ghairi',
    'common.save': 'Hifadhi',
    'common.delete': 'Futa',
    'common.edit': 'Hariri',
    'common.back': 'Rudi',
},
  es: {
    // Tab Navigation
    'tab.vibe': 'Vibe',
    'tab.create': 'Create',
    'tab.chat': 'Chat',
    'tab.profile': 'Profile',
    'tab.wallet': 'Wallet',
    'tab.music': 'Music',

    // Vibe Screen
    'vibe.title': 'Vibe Feed',
    'vibe.likes': 'Likes',
    'vibe.comments': 'Comments',
    'vibe.share': 'Share',

    // Create Screen
    'create.title': 'AI Studio',
    'create.musicVideo': 'Music Video',
    'create.aiCameo': 'AI Cameo',
    'create.aiImage': 'AI Image',
    'create.prompt': 'Enter prompt...',
    'create.style': 'Style',
    'create.generate': 'Generate',
    'create.generating': 'Generating...',
    'create.quotaExceeded': 'Daily quota exceeded',
    'create.upgradeNow': 'Upgrade Now',

    // Chat Screen
    'chat.title': 'Chat',
    'chat.messages': 'Messages',
    'chat.friends': 'Friends',
    'chat.searchFriends': 'Search friends...',
    'chat.addFriend': 'Add Friend',
    'chat.typeMessage': 'Type message...',
    'chat.send': 'Send',
    'chat.online': 'Online',
    'chat.offline': 'Offline',

    // Profile Screen
    'profile.title': 'Profile',
    'profile.followers': 'Followers',
    'profile.views': 'Views',
    'profile.likes': 'Likes',
    'profile.follow': 'Follow',
    'profile.following': 'Following',
    'profile.message': 'Message',
    'profile.earnings': 'Earnings',
    'profile.withdraw': 'Withdraw',

    // Wallet Screen
    'wallet.title': 'Wallet',
    'wallet.balance': 'Balance',
    'wallet.transactions': 'Transactions',
    'wallet.currentTier': 'Current Tier',
    'wallet.upgrade': 'Upgrade',
    'wallet.free': 'Free',
    'wallet.pro': 'Pro',
    'wallet.elite': 'Elite',
    'wallet.perDay': 'per day',
    'wallet.perMonth': 'per month',
    'wallet.mostPopular': 'Most Popular',
    'wallet.unlimited': 'Unlimited',

    // Music Screen
    'music.title': 'Music Library',
    'music.beats': 'Beats',
    'music.useBeat': 'Use Beat',
    'music.downloads': 'Downloads',
    'music.bpm': 'BPM',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.about': 'About',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.back': 'Back',
  },

  fr: {
    // Tab Navigation
    'tab.vibe': 'Vibe',
    'tab.create': 'Create',
    'tab.chat': 'Chat',
    'tab.profile': 'Profile',
    'tab.wallet': 'Wallet',
    'tab.music': 'Music',

    // Vibe Screen
    'vibe.title': 'Vibe Feed',
    'vibe.likes': 'Likes',
    'vibe.comments': 'Comments',
    'vibe.share': 'Share',

    // Create Screen
    'create.title': 'AI Studio',
    'create.musicVideo': 'Music Video',
    'create.aiCameo': 'AI Cameo',
    'create.aiImage': 'AI Image',
    'create.prompt': 'Enter prompt...',
    'create.style': 'Style',
    'create.generate': 'Generate',
    'create.generating': 'Generating...',
    'create.quotaExceeded': 'Daily quota exceeded',
    'create.upgradeNow': 'Upgrade Now',

    // Chat Screen
    'chat.title': 'Chat',
    'chat.messages': 'Messages',
    'chat.friends': 'Friends',
    'chat.searchFriends': 'Search friends...',
    'chat.addFriend': 'Add Friend',
    'chat.typeMessage': 'Type message...',
    'chat.send': 'Send',
    'chat.online': 'Online',
    'chat.offline': 'Offline',

    // Profile Screen
    'profile.title': 'Profile',
    'profile.followers': 'Followers',
    'profile.views': 'Views',
    'profile.likes': 'Likes',
    'profile.follow': 'Follow',
    'profile.following': 'Following',
    'profile.message': 'Message',
    'profile.earnings': 'Earnings',
    'profile.withdraw': 'Withdraw',

    // Wallet Screen
    'wallet.title': 'Wallet',
    'wallet.balance': 'Balance',
    'wallet.transactions': 'Transactions',
    'wallet.currentTier': 'Current Tier',
    'wallet.upgrade': 'Upgrade',
    'wallet.free': 'Free',
    'wallet.pro': 'Pro',
    'wallet.elite': 'Elite',
    'wallet.perDay': 'per day',
    'wallet.perMonth': 'per month',
    'wallet.mostPopular': 'Most Popular',
    'wallet.unlimited': 'Unlimited',

    // Music Screen
    'music.title': 'Music Library',
    'music.beats': 'Beats',
    'music.useBeat': 'Use Beat',
    'music.downloads': 'Downloads',
    'music.bpm': 'BPM',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.about': 'About',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.back': 'Back',
  },

  pt: {
    // Tab Navigation
    'tab.vibe': 'Vibe',
    'tab.create': 'Create',
    'tab.chat': 'Chat',
    'tab.profile': 'Profile',
    'tab.wallet': 'Wallet',
    'tab.music': 'Music',

    // Vibe Screen
    'vibe.title': 'Vibe Feed',
    'vibe.likes': 'Likes',
    'vibe.comments': 'Comments',
    'vibe.share': 'Share',

    // Create Screen
    'create.title': 'AI Studio',
    'create.musicVideo': 'Music Video',
    'create.aiCameo': 'AI Cameo',
    'create.aiImage': 'AI Image',
    'create.prompt': 'Enter prompt...',
    'create.style': 'Style',
    'create.generate': 'Generate',
    'create.generating': 'Generating...',
    'create.quotaExceeded': 'Daily quota exceeded',
    'create.upgradeNow': 'Upgrade Now',

    // Chat Screen
    'chat.title': 'Chat',
    'chat.messages': 'Messages',
    'chat.friends': 'Friends',
    'chat.searchFriends': 'Search friends...',
    'chat.addFriend': 'Add Friend',
    'chat.typeMessage': 'Type message...',
    'chat.send': 'Send',
    'chat.online': 'Online',
    'chat.offline': 'Offline',

    // Profile Screen
    'profile.title': 'Profile',
    'profile.followers': 'Followers',
    'profile.views': 'Views',
    'profile.likes': 'Likes',
    'profile.follow': 'Follow',
    'profile.following': 'Following',
    'profile.message': 'Message',
    'profile.earnings': 'Earnings',
    'profile.withdraw': 'Withdraw',

    // Wallet Screen
    'wallet.title': 'Wallet',
    'wallet.balance': 'Balance',
    'wallet.transactions': 'Transactions',
    'wallet.currentTier': 'Current Tier',
    'wallet.upgrade': 'Upgrade',
    'wallet.free': 'Free',
    'wallet.pro': 'Pro',
    'wallet.elite': 'Elite',
    'wallet.perDay': 'per day',
    'wallet.perMonth': 'per month',
    'wallet.mostPopular': 'Most Popular',
    'wallet.unlimited': 'Unlimited',

    // Music Screen
    'music.title': 'Music Library',
    'music.beats': 'Beats',
    'music.useBeat': 'Use Beat',
    'music.downloads': 'Downloads',
    'music.bpm': 'BPM',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.about': 'About',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.back': 'Back',
  },

  it: {
    // Tab Navigation
    'tab.vibe': 'Vibe',
    'tab.create': 'Create',
    'tab.chat': 'Chat',
    'tab.profile': 'Profile',
    'tab.wallet': 'Wallet',
    'tab.music': 'Music',

    // Vibe Screen
    'vibe.title': 'Vibe Feed',
    'vibe.likes': 'Likes',
    'vibe.comments': 'Comments',
    'vibe.share': 'Share',

    // Create Screen
    'create.title': 'AI Studio',
    'create.musicVideo': 'Music Video',
    'create.aiCameo': 'AI Cameo',
    'create.aiImage': 'AI Image',
    'create.prompt': 'Enter prompt...',
    'create.style': 'Style',
    'create.generate': 'Generate',
    'create.generating': 'Generating...',
    'create.quotaExceeded': 'Daily quota exceeded',
    'create.upgradeNow': 'Upgrade Now',

    // Chat Screen
    'chat.title': 'Chat',
    'chat.messages': 'Messages',
    'chat.friends': 'Friends',
    'chat.searchFriends': 'Search friends...',
    'chat.addFriend': 'Add Friend',
    'chat.typeMessage': 'Type message...',
    'chat.send': 'Send',
    'chat.online': 'Online',
    'chat.offline': 'Offline',

    // Profile Screen
    'profile.title': 'Profile',
    'profile.followers': 'Followers',
    'profile.views': 'Views',
    'profile.likes': 'Likes',
    'profile.follow': 'Follow',
    'profile.following': 'Following',
    'profile.message': 'Message',
    'profile.earnings': 'Earnings',
    'profile.withdraw': 'Withdraw',

    // Wallet Screen
    'wallet.title': 'Wallet',
    'wallet.balance': 'Balance',
    'wallet.transactions': 'Transactions',
    'wallet.currentTier': 'Current Tier',
    'wallet.upgrade': 'Upgrade',
    'wallet.free': 'Free',
    'wallet.pro': 'Pro',
    'wallet.elite': 'Elite',
    'wallet.perDay': 'per day',
    'wallet.perMonth': 'per month',
    'wallet.mostPopular': 'Most Popular',
    'wallet.unlimited': 'Unlimited',

    // Music Screen
    'music.title': 'Music Library',
    'music.beats': 'Beats',
    'music.useBeat': 'Use Beat',
    'music.downloads': 'Downloads',
    'music.bpm': 'BPM',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.about': 'About',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.back': 'Back',
  },

  de: {
    // Tab Navigation
    'tab.vibe': 'Vibe',
    'tab.create': 'Create',
    'tab.chat': 'Chat',
    'tab.profile': 'Profile',
    'tab.wallet': 'Wallet',
    'tab.music': 'Music',

    // Vibe Screen
    'vibe.title': 'Vibe Feed',
    'vibe.likes': 'Likes',
    'vibe.comments': 'Comments',
    'vibe.share': 'Share',

    // Create Screen
    'create.title': 'AI Studio',
    'create.musicVideo': 'Music Video',
    'create.aiCameo': 'AI Cameo',
    'create.aiImage': 'AI Image',
    'create.prompt': 'Enter prompt...',
    'create.style': 'Style',
    'create.generate': 'Generate',
    'create.generating': 'Generating...',
    'create.quotaExceeded': 'Daily quota exceeded',
    'create.upgradeNow': 'Upgrade Now',

    // Chat Screen
    'chat.title': 'Chat',
    'chat.messages': 'Messages',
    'chat.friends': 'Friends',
    'chat.searchFriends': 'Search friends...',
    'chat.addFriend': 'Add Friend',
    'chat.typeMessage': 'Type message...',
    'chat.send': 'Send',
    'chat.online': 'Online',
    'chat.offline': 'Offline',

    // Profile Screen
    'profile.title': 'Profile',
    'profile.followers': 'Followers',
    'profile.views': 'Views',
    'profile.likes': 'Likes',
    'profile.follow': 'Follow',
    'profile.following': 'Following',
    'profile.message': 'Message',
    'profile.earnings': 'Earnings',
    'profile.withdraw': 'Withdraw',

    // Wallet Screen
    'wallet.title': 'Wallet',
    'wallet.balance': 'Balance',
    'wallet.transactions': 'Transactions',
    'wallet.currentTier': 'Current Tier',
    'wallet.upgrade': 'Upgrade',
    'wallet.free': 'Free',
    'wallet.pro': 'Pro',
    'wallet.elite': 'Elite',
    'wallet.perDay': 'per day',
    'wallet.perMonth': 'per month',
    'wallet.mostPopular': 'Most Popular',
    'wallet.unlimited': 'Unlimited',

    // Music Screen
    'music.title': 'Music Library',
    'music.beats': 'Beats',
    'music.useBeat': 'Use Beat',
    'music.downloads': 'Downloads',
    'music.bpm': 'BPM',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.about': 'About',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.back': 'Back',
  },

  us: {
    // Tab Navigation
    'tab.vibe': 'Vibe',
    'tab.create': 'Create',
    'tab.chat': 'Chat',
    'tab.profile': 'Profile',
    'tab.wallet': 'Wallet',
    'tab.music': 'Music',

    // Vibe Screen
    'vibe.title': 'Vibe Feed',
    'vibe.likes': 'Likes',
    'vibe.comments': 'Comments',
    'vibe.share': 'Share',

    // Create Screen
    'create.title': 'AI Studio',
    'create.musicVideo': 'Music Video',
    'create.aiCameo': 'AI Cameo',
    'create.aiImage': 'AI Image',
    'create.prompt': 'Enter prompt...',
    'create.style': 'Style',
    'create.generate': 'Generate',
    'create.generating': 'Generating...',
    'create.quotaExceeded': 'Daily quota exceeded',
    'create.upgradeNow': 'Upgrade Now',

    // Chat Screen
    'chat.title': 'Chat',
    'chat.messages': 'Messages',
    'chat.friends': 'Friends',
    'chat.searchFriends': 'Search friends...',
    'chat.addFriend': 'Add Friend',
    'chat.typeMessage': 'Type message...',
    'chat.send': 'Send',
    'chat.online': 'Online',
    'chat.offline': 'Offline',

    // Profile Screen
    'profile.title': 'Profile',
    'profile.followers': 'Followers',
    'profile.views': 'Views',
    'profile.likes': 'Likes',
    'profile.follow': 'Follow',
    'profile.following': 'Following',
    'profile.message': 'Message',
    'profile.earnings': 'Earnings',
    'profile.withdraw': 'Withdraw',

    // Wallet Screen
    'wallet.title': 'Wallet',
    'wallet.balance': 'Balance',
    'wallet.transactions': 'Transactions',
    'wallet.currentTier': 'Current Tier',
    'wallet.upgrade': 'Upgrade',
    'wallet.free': 'Free',
    'wallet.pro': 'Pro',
    'wallet.elite': 'Elite',
    'wallet.perDay': 'per day',
    'wallet.perMonth': 'per month',
    'wallet.mostPopular': 'Most Popular',
    'wallet.unlimited': 'Unlimited',

    // Music Screen
    'music.title': 'Music Library',
    'music.beats': 'Beats',
    'music.useBeat': 'Use Beat',
    'music.downloads': 'Downloads',
    'music.bpm': 'BPM',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.about': 'About',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.back': 'Back',
  },
};
