import { Component, OnInit, Input } from '@angular/core';
import { CitizenReports } from 'src/app/core/models/citizen-reports.model';

@Component({
  selector: 'app-ides-citizen-reports-card',
  templateUrl: './ides-citizen-reports-card.component.html',
  styleUrls: ['./ides-citizen-reports-card.component.scss']
})
export class IdesCitizenReportsCardComponent implements OnInit {

  @Input() items: any;
  hidden = true;
  title = '';
  content = '';
  responsiveOptions: any[] = [];
  reports: any;

  constructor() {

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];

  }

  ngOnInit() {

  }

  getValue(item) {
    this.title = item.name;
    this.content = item.description;
  }

}
