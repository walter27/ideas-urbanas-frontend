import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFontAwesomeComponent } from 'angular-font-awesome';
declare var $: any;
let { capitalizeFirst } = require('../../core/utils/utils');

@Component({
  selector: 'app-navbar-item',
  templateUrl: './navbar-item.component.html',
  styleUrls: ['./navbar-item.component.scss']
})
export class NavbarItemComponent implements OnInit {

  @Input() item;
  @Output() showMore = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
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