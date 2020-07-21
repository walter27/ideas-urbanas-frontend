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

  ngOnInit() {

  }

  ngDoCheck() {

    if (this.route.url === '/covid' || this.route.url === '/thematic' ||
      this.route.url === '/cities' || this.route.url === '/indexes' || this.route.url === '/citizen-reports' ||
      this.regionService.citySelect) {

      if (this.pos > 20 && this.utilService.buttonVisible === false) {
        console.log('CAMBIAR', this.utilService.buttonVisible);

        this.textColorNav = 'nav-item';
      } else {

        this.textColorNav = 'nav-item-covid';
      }
    } else {

      if (this.utilService.buttonVisible === true) {
        this.textColorNav = 'nav-item-covid';

      } else {
        console.log('CAMBIAR2', this.utilService.buttonVisible);

        this.textColorNav = 'nav-item';

      }


    }

    if (this.utilService.buttonVisible === true) {

      //console.log('CAMBIAR3', this.utilService.buttonVisible);

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
    if (item.title === 'about us') {
      this.utilService.itemSelected = item;
    } else {
      window.scrollTo(0, 0);
      this.utilService.itemSelected = undefined;
    }

  }

  capitalizeFirst(str) {
    return capitalizeFirst(str);
  }

}