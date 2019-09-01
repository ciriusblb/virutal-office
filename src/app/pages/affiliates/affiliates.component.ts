import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService, AffiliatesService, ModalService } from '../../services/service.index';
import { Affiliate } from '../../models/affiliate.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-affiliates',
  templateUrl: './affiliates.component.html',
  styleUrls: ['./affiliates.component.css']
})
export class AffiliatesComponent implements OnInit {
  forma: FormGroup;
  sponsor: any;
  afiliados: Array<any> = [];
  IsmodelShow: boolean;
  constructor(public _userService: UserService, public _affiliatesService: AffiliatesService, public _modalService: ModalService) { }

  pyramid: any = {
    DNI: this._userService.user.DNI,
    name: this._userService.user.name,
    lastname: this._userService.user.lastname,
    rank: this._userService.user.rank,
    points: this._userService.user.points,
    arm: this._userService.user.arm,
    size: undefined,
    arms: {},
    afiliados: []
  };
  ngOnInit() {
    this.getAffiliates(undefined, this._userService.user.DNI, 2);
    this.initForm();
  }
  getAffiliates(size: number, DNI: number, level: number, thirdLevel?: number, fourthLevel?: number) {
    if (size === undefined) {
     this._affiliatesService.getAffiliates(DNI)
      .subscribe((resp: any) => {
        switch (level) {
          case 2: this.addSecondLevel(resp.getDocs); break;
          case 3: this.addThirdLevel(resp.getDocs, thirdLevel); break;
          case 4: this.addFourthLevel(resp.getDocs, thirdLevel, fourthLevel); break;
        }
      });
    }
  }
  initForm() {
    this.forma = new FormGroup({
      email: new FormControl( null, [Validators.required, Validators.email]),
      sponsor: new FormControl( null, Validators.required),
      arm: new FormControl( null, Validators.required)
    });
  }

  registerAffiliate() {
    if (this.forma.invalid) {
      return;
    }
    this.forma.value.arm = Number(this.forma.value.arm);
    const affiliate = new Affiliate(
      this._userService.user.DNI,
      this.forma.value.email,
      this.forma.value.arm,
      'Afiliación',
      this.sponsor,
    );
    this._modalService.ocultarModal();
    Swal({
      title: 'Registrando cuenta',
      html: 'Registrando cuenta del nuevo afiliado',
    });
    Swal.showLoading();
    this._affiliatesService.registerAffiliate(affiliate)
      .subscribe(resp => {
        Swal.hideLoading();
        Swal('Cuenta Activada', resp.data.email, 'success');
      });
  }
  addSponsor(sponsor: any, arm: String) {
    this.forma.setValue({
      email: '',
      sponsor: sponsor.DNI,
      arm: arm
    });
    this.sponsor = {
      DNI: sponsor.DNI,
      name: sponsor.name,
      lastname: sponsor.lastname,
      rank: sponsor.rank,
      sponsor: sponsor.sponsor
    };
    this.forma.setValue({
      email: this.forma.value.email,
      sponsor: sponsor.DNI,
      arm: arm
    });
    this._modalService.mostrarModal();
  }
  addSecondLevel(array) {
    for (let index = 0; index < array.size; index++) {
      this.pyramid.afiliados.push(array.afiliados[index]);
    }
    this.pyramid.size = array.size;
    this.pyramid.arms = array.arms;
  }
  addThirdLevel(array, x) {
    for (let index = 0; index < array.size; index++) {
      this.pyramid.afiliados[x].afiliados.push(array.afiliados[index]);
    }
    this.pyramid.afiliados[x].size = array.size;
    this.pyramid.afiliados[x].arms = array.arms;
  }
  addFourthLevel(array, x, y) {
    for (let index = 0; index < array.size; index++) {
      this.pyramid.afiliados[x].afiliados[y].afiliados.push(array.afiliados[index]);
    }
    this.pyramid.afiliados[x].afiliados[y].size = array.size;
    this.pyramid.afiliados[x].afiliados[y].arms = array.arms;
  }
}
