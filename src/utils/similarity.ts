import * as fuzzball from 'fuzzball';

export function calculateSimilarity(userTranscript: string, template: string): number {
  const normalizedUser = userTranscript.toLowerCase().trim();
  const normalizedTemplate = template.toLowerCase().trim();

  if (!normalizedUser || !normalizedTemplate) return 0;

  return fuzzball.ratio(normalizedUser, normalizedTemplate);
}
