import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ides-dropdown',
  templateUrl: './ides-dropdown.component.html',
  styleUrls: ['./ides-dropdown.component.scss']
})
export class IdesDropdownComponent implements OnInit {

  @Input() title: string;
  @Input() items: any[];
  @Input() selectable = true;

  @Output() checkItem = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onCheckItem(id) {
    this.checkItem.emit(id);
  }

}
