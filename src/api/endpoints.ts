export const API_BASE_URL = 'https://api.langenter.com';

export const Endpoints = {
  // Auth
  LOGIN: '/v1/api/account/login',
  LOGIN_MEMBER: '/v1/api/account/members/login',
  REGISTER_SEND_OTP: '/v1/api/account/register/send-otp',
  REGISTER_VERIFY_OTP: '/v1/api/account/register/verify-otp',
  REGISTER_SAVE_PASSWORD: '/v1/api/account/register/save-password',
  FORGOT_PASSWORD: '/v1/api/account/forgot-password',

  // Courses & Content
  COURSE_LIST: '/v1/api/library/courses',
  DOCUMENT_LIST: '/v1/api/library/documents',
  PARAGRAPH_LIST: '/v1/api/library/paragraphs',
  PARAGRAPH_DETAIL_V3: '/v3/api/library/paragraphs',

  // Sentences
  SENTENCE_LIST_V1: '/v1/api/library/sentences',
  SENTENCE_LIST_V3: '/v3/api/library/sentences',

  // Learning Actions
  START_PARAGRAPH: '/v1/api/transaction/start-paragraph',
  END_LISTEN: '/v1/api/library/learn/listen/end',
  END_SPEAK: '/v1/api/library/learn/speak/end',
  BACK_SENTENCE: '/v1/api/transaction/learn/back-sentence',
  SPEAK_LIST: '/v1/api/library/learn/speak/list',

  // Translation & Dictionary
  TRANSLATE_SENTENCE: '/v1/api/library/learn/translate/sentence',
  DICTIONARY: '/v1/api/library/learn/dictionary',

  // Members & Profile
  MEMBER_LIST: '/v1/api/account/members',
  MEMBER_CATEGORIES: '/v1/api/account/categories',
  UPDATE_ACCOUNT: '/v1/api/account/update-account',

  // Transactions & Reports
  REPORT_TOKENS: '/v1/api/transaction/report/report-tokens',
  MEMBER_TOKEN_LIST: '/v1/api/transaction/report-member-token/list',
  HISTORY_LIST: '/v1/api/transaction/history/list',
  HISTORY_DETAIL: '/v1/api/transaction/history/detail',

  // Exercises
  EXERCISE_LIST: '/v1/api/config/account-exercises',

  // News
  NEWS_LIST: '/v1/api/transaction/news',

  // Reports
  REPORT_LEARNS: '/v1/api/transaction/report/report-learns',
  REPORT_TOTAL_LEARNS: '/v1/api/transaction/report/report-total-learns',

  // Favourites
  FAVOURITE_ADD: '/v1/api/library/paragraphs/favourite',
  FAVOURITE_LIST: '/v1/api/library/paragraphs/favourites',
} as const;
