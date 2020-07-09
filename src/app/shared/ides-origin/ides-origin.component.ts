import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ides-origin',
  templateUrl: './ides-origin.component.html',
  styleUrls: ['./ides-origin.component.scss']
})
export class IdesOriginComponent implements OnInit {


  @Input() origins;




  constructor() { }

  ngOnInit() {

  }

  getOrigins() {
    let solve = '';
    if (this.origins) {
      this.origins.forEach((or, idx) => {
        if (idx !== 0) {
          solve += ', ';
        }
        solve += or.name;
      });
    }
    return solve;
  }




}
