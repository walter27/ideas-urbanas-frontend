import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-basic-news',
  templateUrl: './card-basic-news.component.html',
  styleUrls: ['./card-basic-news.component.scss']
})
export class CardBasicNewsComponent implements OnInit {

  news: any = [];
  responsiveOptions;


  constructor() {



    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
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


    this.news = [
      {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/IDEAS1-01.png'
      },
      {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/IDEAS2-02.png'

      },
      {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/IDEAS3-03.png'

      },
      {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/IDEAS4-04.png'

      },
      {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/MARSCARILLAS-07.png'

      },
      {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/BICICLETAS-19.png'

      }, {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/BICICLETAS-20.png'

      }, {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/BICICLETAS-21.png'

      }, {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/bicicletas-22.png'

      }
    ];


  }

  ngOnInit() {
  }



}
