import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/canvas1', pathMatch: 'full' },
  { path: 'canvas1', loadComponent: () => import('./canvas1/canvas1.component').then(c => c.Canvas1Component) },
  { path: 'canvas2', loadComponent: () => import('./canvas2/canvas2.component').then(c => c.Canvas2Component) },
  { path: 'canvas3', loadComponent: () => import('./canvas3/canvas3.component').then(c => c.Canvas3Component) },
  { path: '**', redirectTo: '/canvas1' }
];
