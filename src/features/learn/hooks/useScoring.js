// Basic scoring hook. Calculates score based on baseXP, time, and steps.
import { useMemo } from 'react';

export function useScoring({ baseXP = 100, timeMs = 0, steps = [] }) {
  return useMemo(() => {
    // Time factor: faster = bonus (max 50% bonus if under par time)
    const timeSecs = Math.max(1, Math.floor(timeMs / 1000));
    const timeFactor = Math.max(0.5, 1 - timeSecs / 300); // decays over 5 minutes

    // Steps factor: fewer steps better. Baseline uses steps length as penalty.
    const stepPenalty = Math.max(0.5, 1 - steps.length / 50);

    const score = Math.round(baseXP * timeFactor * stepPenalty);
    return { score, timeFactor, stepPenalty };
  }, [baseXP, timeMs, steps]);
}
