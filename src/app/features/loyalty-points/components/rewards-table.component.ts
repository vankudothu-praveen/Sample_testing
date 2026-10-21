import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Reward } from '../data-access/loyalty-points.models';

type SortKey = 'name' | 'price';

@Component({
  selector: 'app-rewards-table', standalone: true, imports: [NgFor, NgIf, DecimalPipe],
  template: `
    <div class="table-scroll"><table>
      <caption class="visually-hidden">Available loyalty rewards</caption>
      <thead><tr>
        <th scope="col" [attr.aria-sort]="sortAria('name')"><button class="sort-button" type="button" (click)="sortBy('name')">Name <span aria-hidden="true">{{ sortIndicator('name') }}</span></button></th>
        <th scope="col" [attr.aria-sort]="sortAria('price')"><button class="sort-button" type="button" (click)="sortBy('price')">Price <span aria-hidden="true">{{ sortIndicator('price') }}</span></button></th>
        <th scope="col">Machine type</th><th scope="col">Status</th><th scope="col"><span class="visually-hidden">Actions</span></th>
      </tr></thead>
      <tbody>
        <tr *ngFor="let reward of sortedRewards; trackBy: trackById">
          <th scope="row">{{ reward.name }}</th><td>{{ reward.price | number }} points</td><td>{{ reward.machineType }}</td>
          <td><label class="switch-label"><input type="checkbox" role="switch" [checked]="reward.enabled" [attr.aria-label]="'Enable ' + reward.name" (change)="onEnabledChange(reward, $event)" /><span>{{ reward.enabled ? 'Enabled' : 'Disabled' }}</span></label></td>
          <td class="actions"><button class="delete-button" type="button" [attr.aria-label]="'Delete reward: ' + reward.name" (click)="deleteReward.emit(reward)"><span aria-hidden="true">×</span></button></td>
        </tr>
        <tr *ngIf="rewards.length === 0"><td class="empty-state" colspan="5">No rewards have been added yet.</td></tr>
      </tbody>
    </table></div>`,
  styles: [`
    :host{display:block}.table-scroll{overflow-x:auto}table{width:100%;border-collapse:collapse;text-align:left}th,td{padding:14px 16px;border-bottom:1px solid var(--color-border);white-space:nowrap}thead th{color:var(--color-text-muted);font-size:12px;font-weight:600}tbody th{font-weight:600}.sort-button{padding:0;border:0;background:transparent;color:inherit;font-weight:inherit}.switch-label{display:inline-flex;align-items:center;gap:8px}.switch-label input{width:18px;height:18px;margin:0;accent-color:var(--color-primary)}.actions{text-align:right}.delete-button{width:36px;height:36px;border:0;border-radius:var(--radius-small);background:transparent;color:var(--color-danger);font-size:22px}.delete-button:hover{background:var(--color-background)}.empty-state{padding:28px 16px;color:var(--color-text-muted);text-align:center}@media(max-width:600px){th,td{padding:12px}}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RewardsTableComponent {
  @Input() rewards: Reward[] = [];
  @Output() enabledChange = new EventEmitter<{ id: string; enabled: boolean }>();
  @Output() deleteReward = new EventEmitter<Reward>();
  private sortKey: SortKey = 'name';
  private sortAscending = true;

  get sortedRewards(): Reward[] {
    return [...this.rewards].sort((a, b) => {
      const result = this.sortKey === 'name' ? a.name.localeCompare(b.name) : a.price - b.price;
      return this.sortAscending ? result : -result;
    });
  }
  sortBy(key: SortKey): void {
    if (this.sortKey === key) this.sortAscending = !this.sortAscending;
    else { this.sortKey = key; this.sortAscending = true; }
  }
  sortAria(key: SortKey): string { return key !== this.sortKey ? 'none' : this.sortAscending ? 'ascending' : 'descending'; }
  sortIndicator(key: SortKey): string { return key !== this.sortKey ? '↕' : this.sortAscending ? '↑' : '↓'; }
  trackById(_index: number, reward: Reward): string { return reward.id; }
  onEnabledChange(reward: Reward, event: Event): void {
    this.enabledChange.emit({ id: reward.id, enabled: (event.target as HTMLInputElement).checked });
  }
}
