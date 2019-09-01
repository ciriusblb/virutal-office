import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  blClasses: any = [
    { class: 'bg-success'},
    { class: 'bg-info'},
    { class: 'bg-danger'},
    { class: 'bg-warning'},
    { class: 'bg-dark'},
    { class: 'bg-inverse'},
    { class: 'bg-purple'},
    { class: 'bg-over'}
  ];
  constructor() { }
}
