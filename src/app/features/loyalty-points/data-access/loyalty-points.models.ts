export interface EarningSettings {
  enabled: boolean;
  expiryDays: number;
  pointsPerDollar: number;
}

export interface Reward {
  id: string;
  name: string;
  price: number;
  machineType: string;
  enabled: boolean;
}

export interface LoyaltyDashboardData {
  settings: EarningSettings;
  rewards: Reward[];
}
