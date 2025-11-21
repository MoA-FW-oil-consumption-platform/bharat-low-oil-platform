/**
 * Policy Calculator for GST simulations and national impact
 * Simulated GST rates pending Finance Ministry integration
 */

export interface GSTRates {
  healthyOils: { [key: string]: number };
  regularOils: { [key: string]: number };
  unhealthyOils: { [key: string]: number };
}

export interface GSTSimulationResult {
  scenario: string;
  currentRevenue: number;
  projectedRevenue: number;
  revenueDifference: number;
  percentageChange: number;
  affectedUsers: number;
  details: {
    healthyOilConsumption: number;
    regularOilConsumption: number;
    unhealthyOilConsumption: number;
  };
}

export interface NationalImpactMetrics {
  totalUsers: number;
  avgReductionPercentage: number;
  totalOilReduction: number; // in tonnes
  estimatedImportSavings: number; // in INR crores
  healthcareCostAverted: number; // in INR crores
  carbonEmissionReduced: number; // in tonnes CO2
  gstRevenueImpact: number; // in INR crores
}

export class PolicyCalculator {
  // Simulated GST rates (pending Finance Ministry confirmation)
  private static readonly GST_RATES: GSTRates = {
    healthyOils: {
      olive: 5,
      mustard: 5,
      groundnut: 5,
      sesame: 5,
      rice_bran: 5
    },
    regularOils: {
      sunflower: 12,
      soybean: 12,
      safflower: 12,
      corn: 12
    },
    unhealthyOils: {
      palm: 18,
      vanaspati: 18,
      coconut: 18
    }
  };

  // Constants for calculations
  private static readonly OIL_IMPORT_DEPENDENCY = 0.70; // 70% import dependency
  private static readonly AVG_OIL_PRICE_PER_KG = 150; // ₹150 per kg
  private static readonly HEALTHCARE_COST_PER_USER = 5000; // ₹5000 per year
  private static readonly CO2_PER_KG_OIL = 2.5; // 2.5 kg CO2 per kg oil

  /**
   * Simulate GST revenue impact of oil consumption shift
   */
  static simulateGSTImpact(
    userCount: number,
    currentDistribution: { healthy: number; regular: number; unhealthy: number },
    projectedDistribution: { healthy: number; regular: number; unhealthy: number },
    avgConsumptionPerUser: number // liters per month
  ): GSTSimulationResult {
    // Calculate current GST revenue
    const currentHealthyRevenue = userCount * currentDistribution.healthy * avgConsumptionPerUser * 
      this.AVG_OIL_PRICE_PER_KG * (this.GST_RATES.healthyOils.olive / 100);
    
    const currentRegularRevenue = userCount * currentDistribution.regular * avgConsumptionPerUser * 
      this.AVG_OIL_PRICE_PER_KG * (this.GST_RATES.regularOils.sunflower / 100);
    
    const currentUnhealthyRevenue = userCount * currentDistribution.unhealthy * avgConsumptionPerUser * 
      this.AVG_OIL_PRICE_PER_KG * (this.GST_RATES.unhealthyOils.palm / 100);

    const currentRevenue = currentHealthyRevenue + currentRegularRevenue + currentUnhealthyRevenue;

    // Calculate projected GST revenue
    const projectedHealthyRevenue = userCount * projectedDistribution.healthy * avgConsumptionPerUser * 
      this.AVG_OIL_PRICE_PER_KG * (this.GST_RATES.healthyOils.olive / 100);
    
    const projectedRegularRevenue = userCount * projectedDistribution.regular * avgConsumptionPerUser * 
      this.AVG_OIL_PRICE_PER_KG * (this.GST_RATES.regularOils.sunflower / 100);
    
    const projectedUnhealthyRevenue = userCount * projectedDistribution.unhealthy * avgConsumptionPerUser * 
      this.AVG_OIL_PRICE_PER_KG * (this.GST_RATES.unhealthyOils.palm / 100);

    const projectedRevenue = projectedHealthyRevenue + projectedRegularRevenue + projectedUnhealthyRevenue;

    const revenueDifference = projectedRevenue - currentRevenue;
    const percentageChange = ((revenueDifference / currentRevenue) * 100);

    return {
      scenario: 'Oil consumption shift to healthier alternatives',
      currentRevenue: Number(currentRevenue.toFixed(2)),
      projectedRevenue: Number(projectedRevenue.toFixed(2)),
      revenueDifference: Number(revenueDifference.toFixed(2)),
      percentageChange: Number(percentageChange.toFixed(2)),
      affectedUsers: userCount,
      details: {
        healthyOilConsumption: userCount * projectedDistribution.healthy * avgConsumptionPerUser,
        regularOilConsumption: userCount * projectedDistribution.regular * avgConsumptionPerUser,
        unhealthyOilConsumption: userCount * projectedDistribution.unhealthy * avgConsumptionPerUser
      }
    };
  }

  /**
   * Calculate national impact metrics
   */
  static calculateNationalImpact(
    totalUsers: number,
    avgReductionPercentage: number,
    avgConsumptionPerUserPerMonth: number // in liters
  ): NationalImpactMetrics {
    // Total oil reduction in tonnes per year
    const totalOilReduction = (totalUsers * avgConsumptionPerUserPerMonth * 12 * 
      (avgReductionPercentage / 100)) / 1000; // Convert liters to tonnes

    // Import savings (70% of oil is imported)
    const importReduction = totalOilReduction * this.OIL_IMPORT_DEPENDENCY;
    const estimatedImportSavings = (importReduction * this.AVG_OIL_PRICE_PER_KG) / 10000000; // Convert to crores

    // Healthcare cost averted (reduction in lifestyle diseases)
    const healthBeneficiaryRate = 0.30; // 30% of users benefit from health improvements
    const healthcareCostAverted = (totalUsers * healthBeneficiaryRate * 
      this.HEALTHCARE_COST_PER_USER) / 10000000; // Convert to crores

    // Carbon emission reduction
    const carbonEmissionReduced = totalOilReduction * this.CO2_PER_KG_OIL;

    // GST revenue impact (assuming shift to lower GST items)
    const avgGSTDifference = 8; // Average 8% GST difference (18% to 10% average)
    const gstRevenueImpact = -(totalUsers * avgConsumptionPerUserPerMonth * 12 * 
      this.AVG_OIL_PRICE_PER_KG * (avgGSTDifference / 100)) / 10000000; // Negative = revenue loss

    return {
      totalUsers,
      avgReductionPercentage: Number(avgReductionPercentage.toFixed(2)),
      totalOilReduction: Number(totalOilReduction.toFixed(2)),
      estimatedImportSavings: Number(estimatedImportSavings.toFixed(2)),
      healthcareCostAverted: Number(healthcareCostAverted.toFixed(2)),
      carbonEmissionReduced: Number(carbonEmissionReduced.toFixed(2)),
      gstRevenueImpact: Number(gstRevenueImpact.toFixed(2))
    };
  }

  /**
   * Get GST rates
   */
  static getGSTRates(): GSTRates {
    return this.GST_RATES;
  }

  /**
   * Calculate state-wise efficiency ranking
   */
  static rankStates(
    stateData: Array<{ state: string; users: number; avgReduction: number }>
  ): Array<{ rank: number; state: string; users: number; avgReduction: number; efficiency: number }> {
    // Calculate efficiency score (reduction % normalized by user count)
    const rankedStates = stateData.map(state => ({
      ...state,
      efficiency: state.avgReduction * Math.log10(state.users + 1) // Log scale for user count
    }));

    // Sort by efficiency (descending)
    rankedStates.sort((a, b) => b.efficiency - a.efficiency);

    // Add rank
    return rankedStates.map((state, index) => ({
      rank: index + 1,
      state: state.state,
      users: state.users,
      avgReduction: state.avgReduction,
      efficiency: Number(state.efficiency.toFixed(2))
    }));
  }

  /**
   * Calculate cost-benefit analysis
   */
  static calculateCostBenefit(
    programCost: number, // Total program cost in INR crores
    nationalImpact: NationalImpactMetrics
  ): {
    totalBenefits: number;
    netBenefit: number;
    roi: number;
    breakEvenYears: number;
  } {
    const totalBenefits = 
      nationalImpact.estimatedImportSavings + 
      nationalImpact.healthcareCostAverted -
      Math.abs(nationalImpact.gstRevenueImpact); // Subtract GST revenue loss

    const netBenefit = totalBenefits - programCost;
    const roi = (netBenefit / programCost) * 100;
    const breakEvenYears = programCost / totalBenefits;

    return {
      totalBenefits: Number(totalBenefits.toFixed(2)),
      netBenefit: Number(netBenefit.toFixed(2)),
      roi: Number(roi.toFixed(2)),
      breakEvenYears: Number(breakEvenYears.toFixed(2))
    };
  }
}
