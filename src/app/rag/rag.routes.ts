import { Routes } from '@angular/router';

export const RAG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/rag-home/rag-home.component').then(m => m.RagHomeComponent)
  },
  {
    path: 'pdf',
    loadComponent: () =>
      import('./pages/pdf-chat/pdf-chat.component').then(m => m.PdfChatComponent)
  },
  {
    path: 'portfolio',
    loadComponent: () =>
      import('./pages/portfolio-chat/portfolio-chat.component').then(m => m.PortfolioChatComponent)
  }
];
