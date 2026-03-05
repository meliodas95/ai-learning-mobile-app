import { StyleSheet, View } from 'react-native';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { useI18n } from '@/src/i18n';
import { LearnTab } from '@/src/api/types';
import { useLearningStore } from '@/src/store/learningStore';

interface LessonTabBarProps {
  hasKeywords: boolean;
  hasExercise: boolean;
}

export function LessonTabBar({ hasKeywords, hasExercise }: LessonTabBarProps) {
  const { t } = useI18n();
  const activeTab = useLearningStore((s) => s.activeTab);
  const setActiveTab = useLearningStore((s) => s.setActiveTab);

  const segments = [
    { value: LearnTab.LISTEN, label: t('learn.listen') },
    { value: LearnTab.SPEAKING, label: t('learn.speaking') },
    ...(hasKeywords ? [{ value: LearnTab.WORD, label: t('learn.word') }] : []),
    ...(hasExercise ? [{ value: LearnTab.EXERCISE, label: t('learn.exercise') }] : []),
  ];

  return (
    <View style={styles.container}>
      <SegmentedControl
        segments={segments}
        activeValue={activeTab}
        onValueChange={(v) => setActiveTab(v as LearnTab)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingVertical: 8 },
});
