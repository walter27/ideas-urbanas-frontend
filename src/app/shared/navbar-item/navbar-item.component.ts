import { Component, OnInit, Input, Output, EventEmitter, DoCheck, HostListener } from '@angular/core';
import { AngularFontAwesomeComponent } from 'angular-font-awesome';
import { Router } from '@angular/router';
import { RegionService } from '../../core/services/region.service';
import { UtilsService } from '../../core/services/utils.service';
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

  constructor(private route: Router,
    private regionService: RegionService,
    private utilService: UtilsService) {


  }


  @HostListener('window:scroll', ['$event'])
  onWindowIndexScroll($event) {
    this.pos = window.pageYOffset;
  }

  ngOnInit() { }

  ngDoCheck() {



    if (this.route.url === '/home') {

      if (this.pos > 20 && !this.utilService.buttonVisible) {
        this.textColorNav = 'nav-item-covid';

      } else {
        this.textColorNav = 'nav-item';

      }

    }

    if (this.route.url !== '/home' || this.regionService.citySelect) {

      this.textColorNav = 'nav-item-covid';



    }

    if (this.utilService.buttonVisible) {

      this.textColorNav = 'nav-item-covid';

    }

    if (this.utilService.span && !this.utilService.buttonVisible) {
      this.textColorNav = 'nav-item-covid';

    }






  }

  onClickShowMore(event) {
    event.stopPropagation();
    this.showMore.emit({
      id: this.item.id,
      cant: 3
    });
  }

  hideMenu(item) {
    $('#navbarResponsive').collapse('hide');

    if (item.title === 'about') {
      this.utilService.itemSelected = item;
    } else {
      window.scrollTo(0, 0);
      this.utilService.itemSelected = undefined;
      this.regionService.showWordCloud = 1;
    }

  }


  showCloudWord(item) {
    $('#navbarResponsive').collapse('hide');

    if (item === 'discover') {

      this.regionService.showWordCloud = 1;

    }

    if (item === 'say') {

      this.regionService.showWordCloud = 2;

    }
  }

  capitalizeFirst(str) {
    return capitalizeFirst(str);
  }

}