import { StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { LearnTab } from '@/src/api/types';
import { useLearningStore } from '@/src/store/learningStore';

interface LessonTabBarProps {
  hasKeywords: boolean;
  hasExercise: boolean;
}

export function LessonTabBar({ hasKeywords, hasExercise }: LessonTabBarProps) {
  const { t } = useTranslation();
  const activeTab = useLearningStore((s) => s.activeTab);
  const setActiveTab = useLearningStore((s) => s.setActiveTab);

  const buttons = [
    { value: LearnTab.LISTEN, label: t('learn.listen'), icon: 'headphones' },
    { value: LearnTab.SPEAKING, label: t('learn.speaking'), icon: 'microphone' },
    ...(hasKeywords
      ? [{ value: LearnTab.WORD, label: t('learn.word'), icon: 'book-alphabet' }]
      : []),
    ...(hasExercise
      ? [{ value: LearnTab.EXERCISE, label: t('learn.exercise'), icon: 'clipboard-text' }]
      : []),
  ];

  return (
    <SegmentedButtons
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as LearnTab)}
      buttons={buttons}
      style={styles.tabs}
    />
  );
}

const styles = StyleSheet.create({
  tabs: { marginHorizontal: 16, marginVertical: 8 },
});
