import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RewardsTableComponent } from './rewards-table.component';

describe('RewardsTableComponent', () => {
  let fixture: ComponentFixture<RewardsTableComponent>;
  let component: RewardsTableComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RewardsTableComponent] }).compileComponents();
    fixture = TestBed.createComponent(RewardsTableComponent); component = fixture.componentInstance;
    component.rewards = [
      { id: 'b', name: 'Zeta reward', price: 20, machineType: 'All machines', enabled: true },
      { id: 'a', name: 'Alpha reward', price: 10, machineType: 'Drink machine', enabled: false },
    ];
    fixture.detectChanges();
  });
  it('renders reward names', () => { expect(fixture.nativeElement.textContent).toContain('Alpha reward'); expect(fixture.nativeElement.textContent).toContain('Zeta reward'); });
  it('sorts by price', () => { component.sortBy('price'); expect(component.sortedRewards[0].name).toBe('Alpha reward'); });
  it('provides an accessible delete name', () => { expect(fixture.nativeElement.querySelector('[aria-label="Delete reward: Alpha reward"]')).toBeTruthy(); });
});
