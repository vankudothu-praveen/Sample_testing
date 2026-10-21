import { TestBed } from '@angular/core/testing';
import { LoyaltyPointsApiService } from './loyalty-points-api.service';

describe('LoyaltyPointsApiService', () => {
  let service: LoyaltyPointsApiService;
  beforeEach(() => { TestBed.configureTestingModule({}); service = TestBed.inject(LoyaltyPointsApiService); });
  it('returns initial settings and rewards', () => {
    service.getDashboard().subscribe((data) => { expect(data.settings.enabled).toBeTrue(); expect(data.rewards.length).toBeGreaterThan(0); expect(data.rewards[0].id).toBeTruthy(); });
  });
  it('adds a reward and assigns an id', () => {
    service.addReward({ name: 'Test reward', price: 50, machineType: 'All machines', enabled: true }).subscribe((reward) => { expect(reward.id).toBeTruthy(); expect(reward.name).toBe('Test reward'); });
  });
  it('updates a reward enabled state', () => {
    service.getDashboard().subscribe(({ rewards }) => service.setRewardEnabled(rewards[0].id, false).subscribe((updated) => expect(updated?.enabled).toBeFalse()));
  });
});
