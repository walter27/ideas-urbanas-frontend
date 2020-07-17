import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RegionService } from '../../core/services/region.service';


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

  constructor(
    private authService: AuthService,
    private regionService: RegionService,
    private route: Router
  ) {

  }


  @HostListener('window:scroll', ['$event'])
  onWindowIndexScroll($event) {
    this.pos = window.pageYOffset;
    if (this.pos > 20) {
      this.background = 'mat-menu-content';

    } else {

      this.background = 'mat-menu-content2';

    }

  }
  ngOnInit() {

    if (!this.regionService.citySelect && this.route.url === '/home') {

      this.background = 'mat-menu-content2';
    }

  }
  ngDoCheck() {

    if (this.route.url === '/thematic' ||
      this.route.url === '/cities' || this.route.url === '/indexes' || this.route.url === '/citizen-reports') {
      this.background = 'mat-menu-content';
      this.regionService.citySelect = undefined;

    } else {

      if (this.pos < 20) {
        this.background = 'mat-menu-content2';

      }
    }


    if (this.regionService.citySelect && this.route.url === '/home') {
      this.background = 'mat-menu-content';

    }


  }


  changueBackground() {
    this.background = 'mat-menu-content';

    console.log('cambio');

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
