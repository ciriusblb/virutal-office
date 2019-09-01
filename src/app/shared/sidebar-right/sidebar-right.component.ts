import { Component, OnInit, ElementRef } from '@angular/core';
import { SettingsService } from '../../services/service.index';

@Component({
  selector: 'app-sidebar-right',
  templateUrl: './sidebar-right.component.html',
  styles: []
})
export class SidebarRightComponent implements OnInit {

  constructor(private _settingsService: SettingsService) { }

  ngOnInit() {
    this.placeCheck();
  }
  changeColor(theme: string, link: ElementRef) {
    this.applyCheck(link);
    this._settingsService.applyTheme(theme);
  }
  applyCheck(link: any) {
    const selectors: any = document.getElementsByClassName('selector');
    for ( const ref of selectors) {
      ref.classList.remove('working');
    }
    link.classList.add('working');
  }
  placeCheck() {
    const selectors: any = document.getElementsByClassName('selector');
    const theme = this._settingsService.settings.theme;
    for ( const ref of selectors) {
      if (ref.getAttribute('data-theme') === theme) {
        ref.classList.add('working');
        break;
      }
    }
  }
}
