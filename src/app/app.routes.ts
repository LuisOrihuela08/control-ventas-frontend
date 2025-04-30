import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component').then(m =>m.LayoutComponent),
        children: [
            {
                path: 'ventas',
                loadComponent: () => import('./business/ventas/ventas.component').then(m => m.VentasComponent)
            },
            {
                path: 'productos',
                loadComponent: () =>import('./business/productos/productos.component').then(m => m.ProductosComponent)
            },
            {
                path: '',
                redirectTo: 'ventas',
                pathMatch: 'full'
            },
            {
                path: '**',
                redirectTo: 'ventas',
            }
        ]
    }
];
