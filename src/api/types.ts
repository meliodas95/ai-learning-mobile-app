// === Entity Types ===

export interface CourseEntity {
  id: number;
  title: string;
  title_vi?: string;
  status: number;
  study_type?: string;
  documents?: DocumentEntity[];
}

export interface DocumentEntity {
  id: number;
  title: string;
  keyx?: string;
  status: number;
  course_id: number;
  paragraphs: ParagraphEntity[];
  course: CourseEntity;
}

export interface ParagraphEntity {
  id: number;
  title: string;
  keyx?: string;
  status: number;
  document_id: number;
  course_id: number;
  type: ParagraphType;
  position: number;
  description?: string;
  image?: string;
  keywords?: string;
  process_quiz?: number;
  process_approve?: number;
  is_favourite?: boolean;
  account_id?: number;
}

export type ParagraphType = 'conversation' | 'essay' | 'gallery' | 'video';

export interface SentenceEntity {
  id: number;
  content: string;
  status: number;
  course_id: number;
  paragraph_id: number;
  character_id: number;
  start?: number;
  end?: number;
  character_name?: string;
  words?: string;
  words_arr?: string[];
  process_audio: number;
  process_content: number;
  score?: number;
  color?: ScoreColor;
  audios?: AudioEntity[];
  translation?: TranslationItem;
  sentence_group_id?: number;
  group?: number;
  position: number;
}

export interface AudioEntity {
  id: number;
  sentence_id: number;
  voice_id: number;
  accent_id: number;
  duration: number;
  url: string;
  transcription_id?: number;
  length?: number;
  process: number;
}

export interface CharacterEntity {
  id: number;
  voice_id?: number;
  fullname: string;
  gender?: string;
  accent?: string;
  age?: number;
  sentence_current_id?: number;
}

export interface TranslationItem {
  id?: number;
  sentence_id?: number;
  content?: string;
  language?: string;
  translate_google?: string;
  status?: number;
  type?: string;
}

export interface SentenceScoreEntity {
  id: number;
  sentence_id: number;
  character_id: number;
  score: number;
  color: ScoreColor;
  content?: string;
  member_token?: number;
}

export interface MemberEntity {
  id: number;
  fullname: string;
  avatar?: string;
  token: number;
  is_main: boolean;
  account_id: number;
}

export interface UserAccount {
  id: number;
  phone: string;
  fullname: string;
}

export interface DictionaryWord {
  lemma: string;
  pos: string;
  definitions?: string[];
  examples?: string[];
  pronunciation?: string;
}

export interface DictionaryEntity {
  words: DictionaryWord[];
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

// === API Response Types ===

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

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

export interface LoginResponse {
  account: UserAccount;
  member: MemberEntity;
  members: MemberEntity[];
  member_categories: string[];
  account_token: string;
  member_token: string;
}

export interface BalanceResponse {
  member_token: number;
}

export interface ExerciseQuestion {
  id: number;
  content: string;
  type: string;
  answers: ExerciseAnswer[];
  group?: number;
}

export interface ExerciseAnswer {
  id: number;
  content: string;
  is_correct: boolean;
  type: 'text' | 'audio' | 'image';
}

export interface HistoryItem {
  id: number;
  paragraph_id: number;
  paragraph_title?: string;
  course_title?: string;
  score?: number;
  created_at: string;
  type: string;
}

// === Conversation grouping ===

export interface ConversationGroup {
  characterId: number;
  characterName: string;
  sentences: SentenceEntity[];
}

export function groupSentencesByCharacter(sentences: SentenceEntity[]): ConversationGroup[] {
  const groups: ConversationGroup[] = [];
  let currentGroup: ConversationGroup | null = null;

  for (const sentence of sentences) {
    if (!currentGroup || currentGroup.characterId !== sentence.character_id) {
      currentGroup = {
        characterId: sentence.character_id,
        characterName: sentence.character_name ?? 'Unknown',
        sentences: [],
      };
      groups.push(currentGroup);
    }
    currentGroup.sentences.push(sentence);
  }

  return groups;
}
