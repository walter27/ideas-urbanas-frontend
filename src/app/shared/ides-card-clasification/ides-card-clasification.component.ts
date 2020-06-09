import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ides-card-clasification',
  templateUrl: './ides-card-clasification.component.html',
  styleUrls: ['./ides-card-clasification.component.scss']
})
export class IdesCardClasificationComponent implements OnInit {

  @Input() clasification: any;
  @Input() selected: boolean;
  @Input() over: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
