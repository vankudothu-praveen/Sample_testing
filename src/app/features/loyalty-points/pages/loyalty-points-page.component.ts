import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoyaltyPointsApiService } from '../data-access/loyalty-points-api.service';
import { EarningSettings, Reward } from '../data-access/loyalty-points.models';
import { RewardsTableComponent } from '../components/rewards-table.component';

@Component({
  selector: 'app-loyalty-points-page', standalone: true, imports: [NgIf, ReactiveFormsModule, RewardsTableComponent],
  template: `
    <main class="page">
      <header class="page-heading"><h1>Loyalty Points</h1><p>Manage how customers earn and redeem points.</p></header>
      <section class="panel" aria-labelledby="earning-heading">
        <div class="section-heading"><div><h2 id="earning-heading">Earning points</h2><p>Configure how customers earn loyalty points.</p></div>
          <button class="button button-secondary" type="button" (click)="toggleSettingsForm()">{{ editingSettings() ? 'Cancel' : 'Edit' }}</button>
        </div>
        <ng-container *ngIf="settings() as currentSettings">
          <div class="settings-summary" *ngIf="!editingSettings()">
            <label class="switch-label"><input type="checkbox" role="switch" [checked]="currentSettings.enabled" aria-label="Enable earning points" (change)="updateEnabled($event)" /><span>{{ currentSettings.enabled ? 'Enabled' : 'Disabled' }}</span></label>
            <div class="setting-value"><span>Points expire after</span><strong>{{ currentSettings.expiryDays }} days</strong></div>
            <div class="setting-value"><span>Points earned per dollar</span><strong>{{ currentSettings.pointsPerDollar }} points</strong></div>
          </div>
          <form *ngIf="editingSettings()" class="form-row" [formGroup]="settingsForm" (ngSubmit)="saveSettings()">
            <label><span>Points expiry (days)</span><input type="number" min="1" formControlName="expiryDays" /></label>
            <label><span>Points per dollar</span><input type="number" min="1" formControlName="pointsPerDollar" /></label>
            <button class="button button-primary" type="submit" [disabled]="settingsForm.invalid || saving()">Save settings</button>
          </form>
        </ng-container>
      </section>
      <section class="panel" aria-labelledby="rewards-heading">
        <div class="section-heading"><div><h2 id="rewards-heading">Rewards</h2><p>Manage rewards customers can redeem with their points.</p></div>
          <button class="button button-primary" type="button" (click)="toggleRewardForm()">{{ showRewardForm() ? 'Cancel' : 'Add reward' }}</button>
        </div>
        <form *ngIf="showRewardForm()" class="form-row" [formGroup]="rewardForm" (ngSubmit)="addReward()">
          <label><span>Reward name</span><input type="text" formControlName="name" autocomplete="off" required [attr.aria-invalid]="rewardForm.controls.name.touched && rewardForm.controls.name.invalid" /></label>
          <label><span>Price in points</span><input type="number" min="1" formControlName="price" required /></label>
          <label><span>Machine type</span><select formControlName="machineType"><option value="All machines">All machines</option><option value="Drink machine">Drink machine</option><option value="Snack machine">Snack machine</option></select></label>
          <button class="button button-primary" type="submit" [disabled]="rewardForm.invalid || saving()">Create reward</button>
        </form>
        <p *ngIf="errorMessage()" class="error-message" role="alert">{{ errorMessage() }}</p>
        <app-rewards-table [rewards]="rewards()" (enabledChange)="setRewardEnabled($event)" (deleteReward)="removeReward($event)" />
      </section>
      <div *ngIf="toastMessage()" class="toast" role="status" aria-live="polite"><span>{{ toastMessage() }}</span><button type="button" class="toast-close" aria-label="Dismiss notification" (click)="dismissToast()">×</button></div>
    </main>`,
  styles: [`
    .page{width:min(100%,1200px);margin:0 auto;padding:32px}.page-heading{margin-bottom:24px}h1,h2,p{margin-top:0}h1{margin-bottom:6px;font-size:24px}h2{margin-bottom:6px;font-size:17px}.page-heading p,.section-heading p{margin-bottom:0;color:var(--color-text-muted)}.panel{margin-bottom:20px;padding:24px;border:1px solid var(--color-border);border-radius:var(--radius-medium);background:var(--color-surface);box-shadow:var(--shadow-card)}.section-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:20px}.settings-summary{display:flex;flex-wrap:wrap;align-items:center;gap:32px}.setting-value{display:grid;gap:5px}.setting-value span{color:var(--color-text-muted);font-size:12px}.switch-label{display:inline-flex;align-items:center;gap:8px;font-weight:600}.switch-label input{width:18px;height:18px;margin:0;accent-color:var(--color-primary)}.form-row{display:flex;flex-wrap:wrap;align-items:end;gap:16px;padding:12px 0}.form-row label{display:grid;flex:1 1 160px;gap:6px;font-weight:600}input,select{width:100%;min-height:40px;padding:8px 10px;border:1px solid var(--color-border);border-radius:var(--radius-small);background:var(--color-surface);color:var(--color-text)}.button{min-height:40px;padding:9px 16px;border:1px solid transparent;border-radius:var(--radius-small);font-weight:600}.button-primary{background:var(--color-primary);color:white}.button-primary:hover:not(:disabled){background:var(--color-primary-hover)}.button-secondary{border-color:var(--color-border);background:white;color:var(--color-text)}.button:disabled{cursor:not-allowed;opacity:.6}.error-message{color:var(--color-danger)}.toast{position:fixed;right:24px;bottom:24px;z-index:10;display:flex;align-items:center;gap:18px;max-width:min(420px,calc(100vw - 32px));padding:14px 16px;border:1px solid #c6e6d0;border-radius:var(--radius-medium);background:var(--color-success-background);color:var(--color-success-text);box-shadow:var(--shadow-card)}.toast-close{padding:0 4px;border:0;background:transparent;color:inherit;font-size:20px}@media(max-width:700px){.page{padding:20px 16px}.panel{padding:18px 14px}.section-heading{align-items:stretch;flex-direction:column}.section-heading>button{align-self:flex-start}.settings-summary{align-items:flex-start;flex-direction:column;gap:18px}.toast{right:16px;bottom:16px}}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyPointsPageComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(LoyaltyPointsApiService);
  readonly settings = signal<EarningSettings | null>(null);
  readonly rewards = signal<Reward[]>([]);
  readonly editingSettings = signal(false);
  readonly showRewardForm = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly toastMessage = signal('');
  readonly settingsForm = this.formBuilder.group({ expiryDays: [365, [Validators.required, Validators.min(1)]], pointsPerDollar: [10, [Validators.required, Validators.min(1)]] });
  readonly rewardForm = this.formBuilder.group({ name: ['', [Validators.required, Validators.maxLength(80)]], price: [1, [Validators.required, Validators.min(1)]], machineType: ['All machines', Validators.required] });
  private toastTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.api.getDashboard().subscribe({ next: (data) => { this.settings.set(data.settings); this.rewards.set(data.rewards); }, error: () => this.errorMessage.set('Unable to load loyalty point data.') });
  }
  ngOnDestroy(): void { if (this.toastTimer) clearTimeout(this.toastTimer); }
  toggleSettingsForm(): void {
    const next = !this.editingSettings(); this.editingSettings.set(next);
    if (next) { const current = this.settings(); if (current) this.settingsForm.patchValue(current); }
  }
  saveSettings(): void {
    if (this.settingsForm.invalid) { this.settingsForm.markAllAsTouched(); return; }
    const current = this.settings(); if (!current) return;
    this.saving.set(true);
    const updated: EarningSettings = { ...current, expiryDays: Number(this.settingsForm.value.expiryDays), pointsPerDollar: Number(this.settingsForm.value.pointsPerDollar) };
    this.api.updateSettings(updated).subscribe({ next: (value) => { this.settings.set(value); this.editingSettings.set(false); this.saving.set(false); this.showToast('Earning settings saved.'); }, error: () => this.handleError('Unable to save settings.') });
  }
  updateEnabled(event: Event): void {
    const current = this.settings(); if (!current) return;
    this.api.updateSettings({ ...current, enabled: (event.target as HTMLInputElement).checked }).subscribe({ next: (value) => this.settings.set(value), error: () => this.handleError('Unable to update earning status.') });
  }
  toggleRewardForm(): void {
    this.showRewardForm.update((visible) => !visible);
    this.rewardForm.reset({ name: '', price: 1, machineType: 'All machines' });
  }
  addReward(): void {
    if (this.rewardForm.invalid) { this.rewardForm.markAllAsTouched(); return; }
    const value = this.rewardForm.getRawValue(); this.saving.set(true);
    this.api.addReward({ name: value.name!.trim(), price: Number(value.price), machineType: value.machineType!, enabled: true }).subscribe({
      next: (reward) => { this.rewards.update((current) => [...current, reward]); this.showRewardForm.set(false); this.saving.set(false); this.showToast('Reward created successfully.'); },
      error: () => this.handleError('Unable to create the reward.'),
    });
  }
  setRewardEnabled(change: { id: string; enabled: boolean }): void {
    this.api.setRewardEnabled(change.id, change.enabled).subscribe({ next: (updated) => { if (updated) this.rewards.update((current) => current.map((reward) => reward.id === updated.id ? updated : reward)); }, error: () => this.handleError('Unable to update reward status.') });
  }
  removeReward(reward: Reward): void {
    this.api.deleteReward(reward.id).subscribe({ next: () => { this.rewards.update((current) => current.filter((item) => item.id !== reward.id)); this.showToast(`${reward.name} deleted.`); }, error: () => this.handleError('Unable to delete the reward.') });
  }
  dismissToast(): void { this.toastMessage.set(''); if (this.toastTimer) clearTimeout(this.toastTimer); }
  private showToast(message: string): void {
    this.toastMessage.set(message); if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMessage.set(''), 5000);
  }
  private handleError(message: string): void { this.saving.set(false); this.errorMessage.set(message); }
}
