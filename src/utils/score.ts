import type { ScoreColor } from '@/src/api/types';

export function getScoreColor(score: number): ScoreColor {
  if (score < 50) return 'red';
  if (score < 80) return 'yellow';
  return 'green';
}

export function getScoreHex(score: number): string {
  if (score < 50) return '#E53935';
  if (score < 80) return '#FB8C00';
  return '#43A047';
}

export function getScoreMessage(score: number): string {
  if (score < 50) return 'learn.keepPracticing';
  if (score < 80) return 'learn.wellDone';
  return 'learn.excellent';
}
