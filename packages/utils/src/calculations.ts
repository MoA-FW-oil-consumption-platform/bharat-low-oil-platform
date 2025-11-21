import { ICMR_RECOMMENDED_OIL, ICMR_DAILY_LIMIT } from '@bharat-low-oil/shared-types';

/**
 * Oil Consumption Calculation Utilities
 */

export const calculateDailyAverage = (logs: { amount: number }[], days: number): number => {
  if (logs.length === 0) return 0;
  const total = logs.reduce((sum, log) => sum + log.amount, 0);
  return total / days;
};

export const calculateWeeklyAverage = (logs: { amount: number; timestamp: Date }[]): number => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weekLogs = logs.filter((log) => new Date(log.timestamp) >= oneWeekAgo);
  if (weekLogs.length === 0) return 0;

  const total = weekLogs.reduce((sum, log) => sum + log.amount, 0);
  return total / 7;
};

export const calculateMonthlyAverage = (logs: { amount: number; timestamp: Date }[]): number => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const monthLogs = logs.filter((log) => new Date(log.timestamp) >= oneMonthAgo);
  if (monthLogs.length === 0) return 0;

  const total = monthLogs.reduce((sum, log) => sum + log.amount, 0);
  return total / 30;
};

export const calculateComparisonToICMR = (
  monthlyConsumption: number,
  familySize: number = 1
): number => {
  const recommended = ICMR_RECOMMENDED_OIL * familySize;
  if (recommended === 0) return 0;
  return ((monthlyConsumption - recommended) / recommended) * 100;
};

export const determineTrend = (
  currentAvg: number,
  previousAvg: number
): 'increasing' | 'decreasing' | 'stable' => {
  const diff = currentAvg - previousAvg;
  const threshold = previousAvg * 0.05; // 5% threshold

  if (Math.abs(diff) <= threshold) return 'stable';
  return diff > 0 ? 'increasing' : 'decreasing';
};

export const calculateHealthStatus = (
  dailyConsumption: number,
  familySize: number = 1
): 'healthy' | 'moderate' | 'high_risk' => {
  const perPersonConsumption = dailyConsumption / familySize;
  const icmrLimit = ICMR_DAILY_LIMIT;

  if (perPersonConsumption <= icmrLimit) return 'healthy';
  if (perPersonConsumption <= icmrLimit * 1.3) return 'moderate'; // Up to 30% above limit
  return 'high_risk';
};

export const calculateReductionPercentage = (
  currentConsumption: number,
  previousConsumption: number
): number => {
  if (previousConsumption === 0) return 0;
  return ((previousConsumption - currentConsumption) / previousConsumption) * 100;
};

export const calculatePointsForReduction = (reductionPercentage: number): number => {
  if (reductionPercentage >= 30) return 200;
  if (reductionPercentage >= 20) return 100;
  if (reductionPercentage >= 10) return 50;
  return 0;
};

export const estimateMonthlyConsumption = (
  logs: { amount: number; timestamp: Date }[]
): number => {
  if (logs.length === 0) return 0;

  // Get logs from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentLogs = logs.filter((log) => new Date(log.timestamp) >= thirtyDaysAgo);
  const total = recentLogs.reduce((sum, log) => sum + log.amount, 0);

  // If less than 30 days of data, extrapolate
  const daysWithData = Math.min(30, recentLogs.length);
  if (daysWithData < 30) {
    const dailyAvg = total / daysWithData;
    return dailyAvg * 30;
  }

  return total;
};

export const calculateOilSavings = (
  previousMonthly: number,
  currentMonthly: number,
  pricePerLiter: number = 150
): { savedMl: number; savedMoney: number } => {
  const savedMl = Math.max(0, previousMonthly - currentMonthly);
  const savedLiters = savedMl / 1000;
  const savedMoney = savedLiters * pricePerLiter;

  return { savedMl, savedMoney };
};
