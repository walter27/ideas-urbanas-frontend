import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ides-videos',
  templateUrl: './ides-videos.component.html',
  styleUrls: ['./ides-videos.component.scss']
})
export class IdesVideosComponent implements OnInit {

  videos: any;

  constructor() {

    this.videos = [
      {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/webinar.jpeg',
        read: 'https://www.youtube.com/embed/1HmNAagmAeo'

      },
      {
        name: 'noticiaa',
        descriptions: 'loreakksdd',
        img: 'assets/infografias/webinar2.jpeg',
        read: 'https://www.youtube.com/embed/OIFIVO3bjAQ'

      }
    ];
   }

  ngOnInit() {



  }

}
