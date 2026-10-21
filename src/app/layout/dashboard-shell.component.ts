import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-shell', standalone: true, imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="shell">
      <button class="menu-button" type="button" [attr.aria-expanded]="menuOpen()" aria-controls="primary-navigation" (click)="menuOpen.update((open) => !open)"><span class="visually-hidden">{{ menuOpen() ? 'Close navigation menu' : 'Open navigation menu' }}</span><span aria-hidden="true">☰</span></button>
      <nav id="primary-navigation" class="sidebar" [class.sidebar-open]="menuOpen()" aria-label="Primary navigation">
        <a class="brand" routerLink="/loyalty-points">Business Portal</a><span class="nav-label">MANAGEMENT</span>
        <a class="nav-link" routerLink="/loyalty-points" routerLinkActive="active" ariaCurrentWhenActive="page" (click)="menuOpen.set(false)">Loyalty Points</a>
      </nav>
      <div class="content"><header class="topbar"><label for="site-select">Site</label><select id="site-select"><option>Downtown Location</option></select></header><router-outlet /></div>
    </div>`,
  styles: [`
    .sidebar{position:fixed;inset:0 auto 0 0;z-index:5;display:flex;width:var(--sidebar-width);flex-direction:column;gap:12px;padding:24px 16px;background:var(--color-sidebar);color:white}.brand{margin-bottom:30px;color:white;font-size:17px;font-weight:700;text-decoration:none}.nav-label{padding:0 10px;color:#bdcde0;font-size:11px;letter-spacing:.08em}.nav-link{padding:11px 10px;border-radius:var(--radius-small);color:white;text-decoration:none}.nav-link:hover,.nav-link.active{background:rgb(255 255 255 / 14%)}.content{min-height:100vh;margin-left:var(--sidebar-width)}.topbar{display:flex;min-height:64px;align-items:center;justify-content:flex-end;gap:10px;padding:12px 32px;border-bottom:1px solid var(--color-border);background:var(--color-surface)}.topbar label{color:var(--color-text-muted)}.topbar select{min-height:36px;padding:6px 30px 6px 10px;border:1px solid var(--color-border);border-radius:var(--radius-small);background:white;color:var(--color-text)}.menu-button{display:none}@media(max-width:800px){.sidebar{transform:translateX(-100%);transition:transform 160ms ease}.sidebar.sidebar-open{transform:translateX(0)}.content{margin-left:0}.menu-button{position:fixed;top:14px;left:14px;z-index:6;display:grid;width:40px;height:40px;place-items:center;border:1px solid var(--color-border);border-radius:var(--radius-small);background:white}.topbar{padding-left:68px}}@media(prefers-reduced-motion:reduce){.sidebar{transition:none}}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardShellComponent { readonly menuOpen = signal(false); }
