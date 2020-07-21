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
      this.colorIcon = 'ides-text-icon';
      this.colorLanguaje = 'text-white';
      this.colorButton = 'ides-text-white';

    }

  }
  ngDoCheck() {

    if (!this.regionService.citySelect && this.route.url === '/home') {

      this.background = 'mat-menu-content2';
      this.srcImage = 'assets/logos/logo-blanco.svg';
      this.colorIcon = 'ides-text-icon';
      this.colorLanguaje = 'text-white';
      this.colorButton = 'ides-text-white';

      if (this.pos > 15) {

        this.background = 'mat-menu-content';
        this.srcImage = 'assets/logos/logo-blanco.svg';
        this.colorIcon = 'ides-text-icon';
        this.colorLanguaje = 'text-white';
        this.colorButton = 'ides-text-white';


      }

    }



    if (this.regionService.citySelect && this.route.url === '/home') {

      this.background = 'mat-menu-content-covid sticky-top';
      this.srcImage = 'assets/logos/logo-color.svg';
      this.colorIcon = 'ides-text-icon2';
      this.colorLanguaje = 'text-white2';
      this.colorButton = 'ides-text-white2';

      if (this.pos > 20) {

        this.background = 'mat-menu-content';
        this.srcImage = 'assets/logos/logo-blanco.svg';
        this.colorIcon = 'ides-text-icon';
        this.colorLanguaje = 'text-white';
        this.colorButton = 'ides-text-white';


      }


    }
    if (this.route.url === '/covid' || this.route.url === '/thematic' ||
      this.route.url === '/cities' || this.route.url === '/indexes' || this.route.url === '/citizen-reports') {

      this.background = 'mat-menu-content-covid sticky-top';
      this.srcImage = 'assets/logos/logo-color.svg';
      this.colorIcon = 'ides-text-icon2';
      this.colorLanguaje = 'text-white2';
      this.colorButton = 'ides-text-white2';
      this.regionService.citySelect = undefined;


      if (this.pos > 20) {

        this.background = 'mat-menu-content';
        this.srcImage = 'assets/logos/logo-blanco.svg';
        this.colorIcon = 'ides-text-icon';
        this.colorLanguaje = 'text-white';
        this.colorButton = 'ides-text-white';


      }


    }

    if ($('#IdButton').is(':visible')) {

      this.utilService.buttonVisible = true;

    } else {

      console.log('false');
      
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

}
