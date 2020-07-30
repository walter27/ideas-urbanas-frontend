import { Component, OnInit, Input } from '@angular/core';
import { CitizenReports } from 'src/app/core/models/citizen-reports.model';

@Component({
  selector: 'app-ides-citizen-reports-card',
  templateUrl: './ides-citizen-reports-card.component.html',
  styleUrls: ['./ides-citizen-reports-card.component.scss']
})
export class IdesCitizenReportsCardComponent implements OnInit {

  @Input() item: CitizenReports;
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


    this.reports = [
      {
        name: 'Lorem Ipsum',
        descriptions: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book',
        img: 'assets/reports/reporte.jpg',
        read: ' '
      },
      {
        name: 'Lorem Ipsum',
        descriptions: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book',
        img: 'assets/reports/reporte1.jpg',
        read: ' '
      },
      {
        name: 'Lorem Ipsum',
        descriptions: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book',
        img: 'assets/reports/reporte2.jpg',
        read: ' '
      },
      {
        name: 'Lorem Ipsum',
        descriptions: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book',
        img: 'assets/reports/reporte3.jpg',
        read: ' '
      },
    ];
  }

  ngOnInit() { }

  getValue(item) {
    this.title = item.name;
    this.content = item.description;
  }

}
