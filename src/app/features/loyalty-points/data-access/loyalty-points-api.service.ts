import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EarningSettings, LoyaltyDashboardData, Reward } from './loyalty-points.models';

@Injectable({ providedIn: 'root' })
export class LoyaltyPointsApiService {
  private settings: EarningSettings = { enabled: true, expiryDays: 365, pointsPerDollar: 10 };
  private rewards: Reward[] = [
    { id: 'reward-1', name: 'Free small drink', price: 100, machineType: 'All machines', enabled: true },
    { id: 'reward-2', name: 'Snack item', price: 250, machineType: 'Snack machine', enabled: true },
    { id: 'reward-3', name: 'Premium beverage', price: 500, machineType: 'Drink machine', enabled: false },
  ];

  getDashboard(): Observable<LoyaltyDashboardData> {
    return of({ settings: { ...this.settings }, rewards: this.rewards.map((reward) => ({ ...reward })) });
  }

  updateSettings(settings: EarningSettings): Observable<EarningSettings> {
    this.settings = { ...settings };
    return of({ ...this.settings });
  }

  addReward(reward: Omit<Reward, 'id'>): Observable<Reward> {
    const created = { ...reward, id: `reward-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
    this.rewards = [...this.rewards, created];
    return of({ ...created });
  }

  setRewardEnabled(id: string, enabled: boolean): Observable<Reward | undefined> {
    this.rewards = this.rewards.map((reward) => reward.id === id ? { ...reward, enabled } : reward);
    const updated = this.rewards.find((reward) => reward.id === id);
    return of(updated ? { ...updated } : undefined);
  }

  deleteReward(id: string): Observable<void> {
    this.rewards = this.rewards.filter((reward) => reward.id !== id);
    return of(void 0);
  }
}
