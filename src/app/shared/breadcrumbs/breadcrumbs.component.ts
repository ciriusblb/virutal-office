import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  titulo: string;
  constructor(private router: Router, private title: Title, private meta: Meta) {
    this.getDataRoutes().subscribe(data => {
      this.titulo = data.title;
      this.title.setTitle(this.titulo); // cambiar el titulo d el apagina
      const metaTag: MetaDefinition = {
        name: 'description',
        content: this.titulo
      };
      this.meta.updateTag(metaTag); // cambiar el meta sgun la pagina en el que me encuentre.
    });
  }

  ngOnInit() {
  }
  getDataRoutes() {
    return this.router.events.pipe(
      filter( event => event instanceof ActivationEnd),
      filter( (event: ActivationEnd ) => event.snapshot.firstChild === null),
      map( ( event: ActivationEnd ) => event.snapshot.data)
    );
  }

}
