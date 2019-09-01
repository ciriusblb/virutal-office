import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // menu: any [] = [];

  menu: any = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Afiliados', url: '/affiliates' },
        { titulo: 'Historial de Cuentas', url: '/accountHistory' }
      ]
    }
  ];
  constructor() { }
}
