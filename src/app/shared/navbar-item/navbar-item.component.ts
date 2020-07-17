import { Component, OnInit, Input, Output, EventEmitter, DoCheck, HostListener } from '@angular/core';
import { AngularFontAwesomeComponent } from 'angular-font-awesome';
import { Router } from '@angular/router';
declare var $: any;
let { capitalizeFirst } = require('../../core/utils/utils');

@Component({
  selector: 'app-navbar-item',
  templateUrl: './navbar-item.component.html',
  styleUrls: ['./navbar-item.component.scss']
})
export class NavbarItemComponent implements OnInit, DoCheck {

  textColorNav: string;
  pos: number;

  @Input() item;
  @Output() showMore = new EventEmitter<any>();

  constructor(private route: Router) {


  }


  @HostListener('window:scroll', ['$event'])
  onWindowIndexScroll($event) {
    this.pos = window.pageYOffset;
  }

  ngOnInit() {

  }

  ngDoCheck() {
    if (this.route.url === '/covid') {

      if (this.pos > 20) {
        this.textColorNav = 'nav-item';
        //this.srcImage = 'assets/logos/logo-blanco.svg';

      } else {

        this.textColorNav = 'nav-item-covid';
        // this.srcImage = 'assets/logos/logo-blanco.svg';


      }
    } else {
      this.textColorNav = 'nav-item';

    }



  }

  onClickShowMore(event) {
    event.stopPropagation();
    this.showMore.emit({
      id: this.item.id,
      cant: 3
    });
  }

  hideMenu() {
    $('#navbarResponsive').collapse('hide');
  }

  capitalizeFirst(str) {
    return capitalizeFirst(str);
  }

}