import type { ScoreColor } from '@/src/api/types';
import { SCORE_THRESHOLD, SCORE_COLORS } from '@/src/constants';

export function getScoreColor(score: number): ScoreColor {
  if (score < SCORE_THRESHOLD.LOW) return 'red';
  if (score < SCORE_THRESHOLD.MEDIUM) return 'yellow';
  return 'green';
}

export function getScoreHex(score: number): string {
  if (score < SCORE_THRESHOLD.LOW) return SCORE_COLORS.red;
  if (score < SCORE_THRESHOLD.MEDIUM) return SCORE_COLORS.yellow;
  return SCORE_COLORS.green;
}

export function getScoreMessage(score: number): string {
  if (score < SCORE_THRESHOLD.LOW) return 'learn.keepPracticing';
  if (score < SCORE_THRESHOLD.MEDIUM) return 'learn.wellDone';
  return 'learn.excellent';
}
