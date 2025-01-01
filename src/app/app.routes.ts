import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'upload',
  },
  {
    path: 'upload',
    loadComponent: () => import('./upload/view/upload.view').then(c => c.UploadView),
    title: 'Upload',
  },
  {
    path: 'preview',
    loadComponent: () => import('./preview/view/preview.view').then(c => c.PreviewView),
    title: 'Preview'
  },
]

export const subRoutes: Routes = [
  {
    path: 'configuration',
    loadComponent: () => import('./form-config/view/form-config.view').then(c => c.FormConfigView),
    title: 'Configuration'
  },
]
