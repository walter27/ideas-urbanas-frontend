import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RegionService } from '../../core/services/region.service';
import { UtilsService } from '../../core/services/utils.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, DoCheck {

  // @HostListener('window:hashchange', ['$event'] locationHashChanged($event)){
  //   if (location.hash === "#home") {
  //       console.log("Cambio");
  //   }
  // }
  //@HostListener('window:hashchange', ['$event'] )


  //@HostListener('window:scroll', ['$event']) onScrollEvent($event) {
  // let elem: HTMLElement = document.getElementById('navbarMenu');
  //let pos = window.pageYOffset;
  //let location= window.location.href;
  //   let loc=window.location.hash;
  //   if(location==='#/home'){
  //     if (pos > 20) {
  //       elem.style.setProperty("background-color", '#189cff');
  //
  //      } //else {
  //     //     elem.style.setProperty("background-color", 'transparent');
  //     // }
  //
  // }

  //}




  @Input() items: any[];
  @Input() language: any;
  @Output() setLanguage = new EventEmitter<any>();
  @Output() showMore = new EventEmitter<any>();
  overLogin = false;
  testBool = true;


  icons = [
    {
      name: 'twitter',
      link: 'https://twitter.com/intent/tweet?url=http://ides.sales24hours.com&text=Plataforma de Ideas Urbanas'
    },
    {
      name: 'facebook',
      link: 'https://www.facebook.com/sharer.php?u=http://ides.sales24hours.com/#/home'
    }
  ];

  background: string;
  citySelected: any;
  pos: number;
  srcImage: string;
  colorIcon: string;
  colorLanguaje: string;
  colorButton: string;
  colorButton2: string;
  marginSpan = 'margin-span';
  colorSpan: string;
  buttonVisible: boolean;
  logoUniversidad: string;
  backgroundUniversidad: String;

  constructor(
    private authService: AuthService,
    private regionService: RegionService,
    private route: Router,
    private utilService: UtilsService
  ) {

  }


  @HostListener('window:scroll', ['$event'])
  onWindowIndexScroll($event) {
    this.pos = window.pageYOffset;
  }
  ngOnInit() {

    if (!this.regionService.citySelect && this.route.url === '/home') {

      this.background = 'mat-menu-content2';
      this.srcImage = 'assets/logos/logo-blanco.svg';
      this.logoUniversidad = 'assets/logos/logo-01.png';
      this.colorIcon = 'ides-text-icon';
      this.colorLanguaje = 'text-white';
      this.colorButton = 'ides-text-white';
      this.colorButton2 = 'ides-text-white3';
      this.marginSpan = 'margin-span-color';
      this.backgroundUniversidad = "universidad-inicio";
      this.utilService.span = false;




    }

  }
  ngDoCheck() {

    if (!this.regionService.citySelect && this.route.url === '/home') {

      this.background = 'mat-menu-content2';
      this.srcImage = 'assets/logos/logo-blanco.svg';
      this.logoUniversidad = 'assets/logos/logo-01.png';
      this.colorIcon = 'ides-text-icon';
      this.colorLanguaje = 'text-white';
      this.colorButton = 'ides-text-white';
      this.colorButton2 = 'ides-text-white4';
      this.marginSpan = 'margin-span';
      this.backgroundUniversidad = "universidad-inicio";
      this.utilService.span = false;


    }

    if (this.pos > 15) {

      this.background = 'mat-menu-content-covid';
      this.srcImage = 'assets/logos/logo-color.svg';
      this.logoUniversidad = 'assets/logos/color.png';
      this.colorIcon = 'ides-text-icon2';
      this.colorLanguaje = 'text-white2';
      this.colorButton = 'ides-text-white2';
      this.colorButton2 = 'ides-text-white3';
      this.marginSpan = 'margin-span-color';
      this.backgroundUniversidad = "universidad-internas";

      this.utilService.span = true;
    }



    if (this.regionService.citySelectedCloud || this.regionService.citySelect && this.route.url === '/home') {

      this.background = 'mat-menu-content-covid sticky-top';
      this.srcImage = 'assets/logos/logo-color.svg';
      this.logoUniversidad = 'assets/logos/color.png';
      this.colorIcon = 'ides-text-icon2';
      this.colorLanguaje = 'text-white2';
      this.colorButton = 'ides-text-white2';
      this.colorButton2 = 'ides-text-white3';
      this.marginSpan = 'margin-span-color';
      this.backgroundUniversidad = "universidad-internas";
      this.utilService.span = true;


    }


    if (this.route.url !== '/home') {

      this.background = 'mat-menu-content-covid sticky-top';
      this.srcImage = 'assets/logos/logo-color.svg';
      this.logoUniversidad = 'assets/logos/color.png';
      this.colorIcon = 'ides-text-icon2';
      this.colorLanguaje = 'text-white2';
      this.colorButton = 'ides-text-white2';
      this.colorButton2 = 'ides-text-white3';
      this.marginSpan = 'margin-span-color';
      this.backgroundUniversidad = "universidad-internas";
      this.utilService.span = true;
      this.regionService.citySelect = undefined;

    }

    if ($('#IdButton').is(':visible')) {

      this.utilService.buttonVisible = true;
      this.colorIcon = 'ides-text-icon2';
      this.colorLanguaje = 'text-white2';
      this.colorButton = 'ides-text-white2';
      this.buttonVisible = true;

    } else {
      this.buttonVisible = false;
      this.utilService.buttonVisible = false;

    }



  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  getName() {
    return this.authService.getName();
  }

  logout() {
    this.authService.logout();
  }

  onSetLanguage(l) {
    this.setLanguage.emit(l);
  }


  showMenu() {


    this.testBool = this.testBool ? false : true;

  }

}
