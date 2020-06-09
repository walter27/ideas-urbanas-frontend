import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ides-tab-item',
  templateUrl: './ides-tab-item.component.html',
  styleUrls: ['./ides-tab-item.component.scss']
})
export class IdesTabItemComponent implements OnInit {

  @Input() item;
  @Input() active: boolean;

  constructor() { }

  ngOnInit() {
  }

}
