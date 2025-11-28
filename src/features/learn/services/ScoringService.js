export const ScoringService = {
  calculateXP: (baseXP, timeMs, stepsLength) => {
    const timeSecs = Math.max(1, Math.floor(timeMs / 1000));
    const timeFactor = Math.max(0.5, 1 - timeSecs / 300);
    const stepPenalty = Math.max(0.5, 1 - stepsLength / 50);
    return Math.round(baseXP * timeFactor * stepPenalty);
  }
};
