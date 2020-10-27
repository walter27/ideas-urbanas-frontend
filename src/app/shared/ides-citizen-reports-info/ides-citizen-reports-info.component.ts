import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ides-citizen-reports-info',
  templateUrl: './ides-citizen-reports-info.component.html',
  styleUrls: ['./ides-citizen-reports-info.component.scss']
})
export class IdesCitizenReportsInfoComponent implements OnInit {

  images: any[];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];


  responsiveOptions2: any[] = [

    {
      breakpoint: '1024px',
      numVisible: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];


  displayCustom: boolean;

  activeIndex: number = 0;

  constructor() { }

  ngOnInit() {

    this.images = [
      {
        previewImage: 'assets/reports/reporte.png',
        tumbnailImage: 'assets/reports/reporte.png',
        text: 'Defunciones por género ',
        index: 0
      },
      {
        previewImage: 'assets/reports/reporte1.png',
        tumbnailImage: 'assets/reports/reporte1.png',
        text: 'Contagios de personal de salud y seguridad',
        index: 1
      },
      {
        previewImage: 'assets/reports/reporte2.png',
        tumbnailImage: 'assets/reports/reporte2.png',
        text: 'Defunciones por edad en ciudades del Ecuador',
        index: 2
      }, {
        previewImage: 'assets/reports/reporte3.png',
        tumbnailImage: 'assets/reports/reporte3.png',
        text: 'Defunciones por nacionalidada',
        index: 3
      }
    ]
  }

  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }

}
