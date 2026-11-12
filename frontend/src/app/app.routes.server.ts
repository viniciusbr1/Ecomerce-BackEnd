
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'cesta',
    renderMode: RenderMode.Client
  },
  {
    path: 'pedido',
    renderMode: RenderMode.Client
  },
  {
    path: 'meus-pedidos',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
