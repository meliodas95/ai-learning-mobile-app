import { create } from 'zustand';
import {
  LearnTab,
  SpeakingState,
  type SentenceEntity,
  type CharacterEntity,
  type SentenceScoreEntity,
  type ParagraphEntity,
  type ConversationGroup,
} from '@/src/api/types';

interface LearningState {
  // Lesson data
  activeTab: LearnTab;
  paragraph: ParagraphEntity | null;
  sentences: SentenceEntity[];
  characters: CharacterEntity[];
  conversationGroups: ConversationGroup[];

  // Navigation
  currentSentenceIndex: number;
  listenCurrentId: number | null;

  // Speaking
  speakingState: SpeakingState;
  activeCharacter: CharacterEntity | null;
  currentScore: SentenceScoreEntity | null;

  // Balance
  tokenBalance: number;

  // Flags
  isFinished: boolean;

  // Actions
  setActiveTab: (tab: LearnTab) => void;
  setParagraph: (p: ParagraphEntity) => void;
  setSentences: (sentences: SentenceEntity[], characters: CharacterEntity[]) => void;
  setCurrentSentenceIndex: (index: number) => void;
  nextSentence: () => boolean;
  prevSentence: () => boolean;
  setSpeakingState: (state: SpeakingState) => void;
  setActiveCharacter: (char: CharacterEntity | null) => void;
  setCurrentScore: (score: SentenceScoreEntity | null) => void;
  setTokenBalance: (balance: number) => void;
  deductToken: (amount: number) => void;
  setFinished: (finished: boolean) => void;
  setListenCurrentId: (id: number | null) => void;
  getCurrentSentence: () => SentenceEntity | undefined;
  reset: () => void;
}

const initialState = {
  activeTab: LearnTab.LISTEN,
  paragraph: null as ParagraphEntity | null,
  sentences: [] as SentenceEntity[],
  characters: [] as CharacterEntity[],
  conversationGroups: [] as ConversationGroup[],
  currentSentenceIndex: 0,
  listenCurrentId: null as number | null,
  speakingState: SpeakingState.IDLE,
  activeCharacter: null as CharacterEntity | null,
  currentScore: null as SentenceScoreEntity | null,
  tokenBalance: 0,
  isFinished: false,
};

export const useLearningStore = create<LearningState>((set, get) => ({
  ...initialState,

  setActiveTab: (activeTab) => set({ activeTab }),

  setParagraph: (paragraph) => set({ paragraph }),

  setSentences: (sentences, characters) => {
    const groups: ConversationGroup[] = [];
    let current: ConversationGroup | null = null;
    for (const s of sentences) {
      if (!current || current.characterId !== s.character_id) {
        current = {
          characterId: s.character_id,
          characterName: s.character_name ?? 'Unknown',
          sentences: [],
        };
        groups.push(current);
      }
      current.sentences.push(s);
    }
    set({ sentences, characters, conversationGroups: groups });
  },

  setCurrentSentenceIndex: (index) => set({ currentSentenceIndex: index }),

  nextSentence: () => {
    const { currentSentenceIndex, sentences } = get();
    if (currentSentenceIndex < sentences.length - 1) {
      set({ currentSentenceIndex: currentSentenceIndex + 1 });
      return true;
    }
    return false;
  },

  prevSentence: () => {
    const { currentSentenceIndex } = get();
    if (currentSentenceIndex > 0) {
      set({ currentSentenceIndex: currentSentenceIndex - 1 });
      return true;
    }
    return false;
  },

  setSpeakingState: (speakingState) => set({ speakingState }),
  setActiveCharacter: (activeCharacter) => set({ activeCharacter }),
  setCurrentScore: (currentScore) => set({ currentScore }),
  setTokenBalance: (tokenBalance) => set({ tokenBalance }),
  deductToken: (amount) => set((s) => ({ tokenBalance: Math.max(0, s.tokenBalance - amount) })),
  setFinished: (isFinished) => set({ isFinished }),
  setListenCurrentId: (listenCurrentId) => set({ listenCurrentId }),

  getCurrentSentence: () => {
    const { sentences, currentSentenceIndex } = get();
    return sentences[currentSentenceIndex];
  },

  reset: () => set(initialState),
}));
