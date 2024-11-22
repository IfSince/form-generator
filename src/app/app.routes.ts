import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'upload'
  },
  {
    path: 'upload',
    loadComponent: () => import('./upload/upload-view/upload.view').then(c => c.UploadView),
    title: 'Upload'
  }
];
