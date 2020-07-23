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
        img: 'assets/infografias/IDEAS1-01.png',
        read: 'https://twitter.com/escuelagob_ide/status/1260002770389815300/photo/2'
      },
      {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/IDEAS2-02.png',
        read:'https://twitter.com/escuelagob_ide/status/1260002770389815300/photo/3'

      },
      {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/IDEAS3-03.png',
        read: 'https://twitter.com/escuelagob_ide/status/1260002770389815300/photo/4'

      },
      {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/IDEAS4-04.png',
        read: 'https://twitter.com/escuelagob_ide/status/1260002770389815300/photo/1'

      },
      {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/MARSCARILLAS-07.png',
        read: 'https://twitter.com/escuelagob_ide'

      },
      {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/BICICLETAS-19.png',
        read:'https://twitter.com/escuelagob_ide/status/1280899356183461889/photo/1'


      }, {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/BICICLETAS-20.png',
        read: 'https://twitter.com/escuelagob_ide/status/1280899356183461889/photo/2'

      }, {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/BICICLETAS-21.png',
        read: 'https://twitter.com/escuelagob_ide/status/1280899356183461889/photo/3'

      }, {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/bicicletas-22.png',
        read: 'https://twitter.com/escuelagob_ide/status/1280899356183461889/photo/4'

      },
      {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/webinar.jpeg',
        read: 'https://youtu.be/1HmNAagmAeo'

      },
      {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/webinar2.jpeg',
        read: 'https://youtu.be/OIFIVO3bjAQ'

      }
    ];


  }

  ngOnInit() {
  }



}
