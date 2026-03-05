// === API Response Wrapper ===

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// === Auth Types ===

export interface Account {
  id: number;
  phone: string;
  created_at: number;
  status: number;
  role_id?: number;
  role?: { id: number; position?: number; title: string };
  type?: number;
  fullname?: string;
}

export interface Member {
  id: number;
  account_id: number;
  fullname: string;
  nickname: string;
  created_at: number;
  status: number;
  is_main?: number;
  token?: string;
  is_onboard?: number;
  role_id: number;
}

export interface LoginResponse {
  account: Account;
  member: MemberEntity;
  members: MemberEntity[];
  member_categories: CategoryEntity[];
  account_token: string;
  member_token: string;
}

// === Entity Types ===

export interface CategoryEntity {
  id: number;
  title: string;
  keyx: string;
  status: number;
  title_vi: string;
  is_favourite: number;
  parent_id: number | null;
  icon: string | null;
  valuex: string | number | boolean;
  items: CategoryEntity[];
}

export interface CourseEntity {
  id: number;
  title: string;
  title_vi: string;
  status: number;
  study_type: number;
  documents?: DocumentEntity[];
}

export interface DocumentEntity {
  id: number;
  title: string;
  keyx: string;
  status: number;
  course_id: number;
  paragraphs: ParagraphEntity[];
  course: CourseEntity;
}

export interface ParagraphEntity {
  id: number;
  title: string;
  keyx: string;
  status: number;
  document_id: number;
  approve_id?: number;
  document: DocumentEntity;
  type: number;
  position: number;
  description?: string;
  account_id: number;
  course_id: number;
  image?: string;
  process_approve?: number;
  is_favourite?: number;
  item: string;
  ParagraphCurrentTitle: string;
  ParagraphCurrentKeyx: string;
  paragraph_current_id: number;
  document_current_id: number;
  course_current_id: number;
  title_vi?: string;
  course?: CourseEntity;
  description_vi?: string;
  object_id?: number;
  keywords: string;
  process_quiz?: number;
}

export interface SentenceEntity {
  id: number;
  content: string;
  status: number;
  document_id: number;
  course_id: number;
  paragraph_id: number;
  character_id: number;
  character_name?: string;
  start?: number;
  end?: number;
  words: string;
  words_arr: string[];
  process_audio: number;
  process_content: number;
  score?: number;
  color?: string;
  group?: number;
  created_at?: number;
  translation?: TranslationItem | null;
  audios?: AudioEntity[] | null;
  sentence_group_id?: number;
  position?: number;
}

export interface AudioEntity {
  id: number;
  sentence_id: number;
  voice_id: number;
  transcription_id: string;
  accent_id: number;
  duration: number;
  url: string;
  length: number;
  process: number;
  created: number;
  status: number;
}

export interface TranslationItem {
  id: number;
  item: string;
  object_id: number;
  content: string;
  translate_google: string;
  lang_from: string;
  lang_to: string;
  status: number;
  created_at: number;
}

export interface CharacterEntity {
  id: number;
  create_id: number;
  course_id: number;
  document_id: number;
  paragraph_id: number;
  fullname: string;
  gender: string;
  sentence_current_id: number;
}

export interface MemberEntity {
  id: number;
  token: string;
  fullname: string;
  nickname: string;
  avatar: string;
  password: string;
  status: number;
  is_main: number;
  is_onboard: number;
  account_id: number;
  phone?: string;
  member_token?: { quantity?: number };
}

export interface SentenceScoreEntity {
  id: number;
  sentence_id: number;
  character_id: number;
  member_id: number;
  paragraph_id: number;
  score: number;
  color: string;
  content: string;
  member_token: { quantity: number };
}

export interface DictionaryEntity {
  id: number;
  tag_bc: string;
  tag_un: string;
  tag_ti: string;
  title_en: string;
  title: string;
  process: number;
  audio: string;
  means: DictionaryWord[];
}

export interface DictionaryWord {
  id: number;
  word_id: number;
  pos: string;
  pos_group: string;
  pos_ti: string;
  pos_full: string;
  lemma: string;
  word: string;
  phonetic: string;
  translate: string;
  definition: string;
  definition_vi: string;
  process_pos: number;
  status: number;
  title: string;
  title_en: string;
  example_vi: string;
  example: string;
}

export interface SentencePosEntity {
  id: number;
  sentence_id: number;
  word: string;
  lemma: string;
  pos: string;
  status: number;
  word_type: string;
  audio: string;
  phonetic: string;
}

export interface HistoryParagraphEntity {
  id: number;
  course_id: number;
  created_at?: number;
  sentence: SentenceEntity[] | null;
  member_id: number;
  document_id: number;
  paragraph: ParagraphEntity;
  course: CourseEntity;
  title: string | null;
  type: number;
  updated_at?: number;
}

export interface HistorySentenceEntity {
  id: number;
  sentence_id: number;
  created_at?: number;
  sentence?: SentenceEntity | null;
  audios?: AudioEntity[] | null;
  member_id: number;
  updated_at?: number;
}

export interface FavouriteEntity {
  item: string;
  member_id: number;
  id: number;
  object_id: number;
  updated_at: number;
  paragraph?: ParagraphEntity;
}

export interface QuizzQuestion {
  id: number;
  quiz_id: number;
  content: string;
  translate: string;
  status: number;
  type: number;
}

export interface QuizzAnswers {
  id: number;
  question_id: number;
  content: string;
  type: number;
  status: number;
}

export interface TransactionLearnInfo {
  id: number;
  member_id: number;
  process: number;
  start_at: number;
  status: number;
  type: number;
}

export interface ProgressEntity {
  progress?: number | string;
  course_id: number;
  course: CourseEntity;
}

// === API List Response Types ===

export interface SentenceListResponse {
  sentences: SentenceEntity[];
  characters: CharacterEntity[];
  listen_sentence_current_id?: number;
  paragraph_current_id?: number;
  total: number;
}

export interface ParagraphDetailResponse {
  paragraph?: ParagraphEntity;
  sentences: SentenceEntity[];
  characters: CharacterEntity[];
  listen_sentence_current_id?: number;
}

// === Enums ===

export type ScoreColor = 'red' | 'yellow' | 'green';

export enum LearnTab {
  LISTEN = 'listen',
  SPEAKING = 'speaking',
  WORD = 'word',
  EXERCISE = 'exercise',
}

export enum SpeakingState {
  IDLE = 'idle',
  LISTENING = 'listening',
  COUNTDOWN = 'countdown',
  RECORDING = 'recording',
  SCORING = 'scoring',
  SCORED = 'scored',
  FINISHED = 'finished',
}

// === Exercise Types (mobile app specific, extends quiz data) ===

export interface ExerciseQuestion {
  id: number;
  content: string;
  type: number;
  translate: string;
  answers: ExerciseAnswer[];
}

export interface ExerciseAnswer {
  id: number;
  question_id: number;
  content: string;
  type: number;
  status: number;
  is_correct: boolean;
}

// === Conversation grouping ===

export interface ConversationGroup {
  characterId: number;
  characterName: string;
  sentences: SentenceEntity[];
}
