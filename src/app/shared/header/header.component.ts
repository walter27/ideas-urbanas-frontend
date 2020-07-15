import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // @HostListener('window:hashchange', ['$event'] locationHashChanged($event)){
  //   if (location.hash === "#home") {
  //       console.log("Cambio");
  //   }
  // }
  //@HostListener('window:hashchange', ['$event'] )


  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    let elem: HTMLElement = document.getElementById('navbarMenu');
    let pos = window.pageYOffset;
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

  }

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

  constructor(
    private authService: AuthService
  ) { console.log(window.location.href); }

  ngOnInit() {

    console.log('ITEMS', this.items);


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
