import { Component, OnInit, AfterViewInit, Input, HostListener, DoCheck, ViewChild, ElementRef } from '@angular/core';
import { Clasification } from 'src/app/core/models/clasification.model';
import { ResultList } from 'src/app/core/models/resultList.model';
import { Observable, from } from 'rxjs';
import { Filters } from 'src/app/core/models/filters.model';
import { ClasificationService } from 'src/app/core/services/clasification.service';
import { map } from 'rxjs/operators';
import { RegionService } from 'src/app/core/services/region.service';
declare var jQuery: any;
import { TagService } from 'src/app/core/services/tag.service';
import { Tag } from 'src/app/core/models/tags.model';
import { ItemDropdown } from 'src/app/core/models/item-dropdown.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Stopword } from 'src/app/core/models/stopwords.model';
import { NotifierService } from 'angular-notifier';
import { TranslateService, DefaultLangChangeEvent, LangChangeEvent } from '@ngx-translate/core';
let { tagCloud } = require('src/app/core/utils/utils');

//import { fade } from('src/app/ides/modules/home/animations');

import { trigger, style, transition, animate, state } from '@angular/animations';
import { UtilsService } from '../../../../core/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})



export class HomeComponent implements OnInit, DoCheck {

  cities = [
    {
      id: '5e41c9f6d82c451b6859e1ec',
      title: 'Esmeraldas',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'esmeraldas',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 9.5,
      posY: -80.6529467
    },
    {
      id: '5e41c9f6d82c451b6859e564',
      title: 'Tulcán',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'tulcan',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 9.5,
      posY: -77.2529467
    },
    {
      id: '5e41c9f4d82c451b6859d408',
      title: 'Ibarra',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'ibarra',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 8.9,
      posY: -78.122902
    },
    {
      id: '5e41c9f5d82c451b6859dc27',
      title: 'Lago Agrio',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'lago_agrio',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 8.5,
      posY: -75.899119
    },
    {
      id: '5e41c9f5d82c451b6859dd50',
      title: 'Santo Domingo',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'santo_domingo',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 7.8,
      posY: -79.578362
    },
    {
      id: '5e41c9f6d82c451b6859e319',
      title: 'Quito',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'quito',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 7.8,
      posY: -78.4678382
    },
    {
      id: '5e41c9f6d82c451b6859e443',
      title: 'Francisco de Orellana (Coca)',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'coca',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 7.2,
      posY: -75.1542684
    },
    {
      id: '5e41c9f6d82c451b6859e1ef',
      title: 'Manta',
      styleText: { top: '315px', left: '680px', opacity: 0.3 },
      stylePoint: { top: '170px', left: '15px' },
      class: 'manta',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 6.6,
      posY: -82.220396
    },
    {
      id: '5e41c9f7d82c451b6859eb33',
      title: 'Portoviejo',
      styleText: { top: '345px', left: '750px', opacity: 0.3 },
      stylePoint: { top: '175px', left: '80px' },
      class: 'portoviejo',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 6.5,
      posY: -81.064460
    },
    {
      id: '5e41c9f3d82c451b6859cf67',
      title: 'Quevedo',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'quevedo',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 6.5,
      posY: -80.0604035
    },
    {
      id: '5e41c9f7d82c451b6859e693',
      title: 'Ambato',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'ambato',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 6.1,
      posY: -78.5718573
    },
    {
      id: '5e41c9f7d82c451b6859ea0c',
      title: 'Tena',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'tena',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 6.6,
      posY: -77.4031057
    },
    {
      id: '5e41c9f7d82c451b6859e7b9',
      title: 'Babahoyo',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'babahoyo',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 5.4,
      posY: -80.3346459
    },
    {
      id: '5e41c9f6d82c451b6859e0c1',
      title: 'Guaranda',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'guaranda',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 5.4,
      posY: -79.3990379
    },
    {
      id: '5e41c9f5d82c451b6859daff',
      title: 'Salinas',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'salinas',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 4.6,
      posY: -82.558462
    },
    {
      id: '5e41c9f6d82c451b6859e566',
      title: 'Daule',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'duale',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 5.2,
      posY: -80.977669
    },
    {
      id: '5e41c9f5d82c451b6859dd49',
      title: 'Riobamba',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'riobamba',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 5.2,
      posY: -78.765946
    },
    {
      id: '5e41c9f4d82c451b6859d407',
      title: 'Guayaquil',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'guayaquil',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 4.5,
      posY: -80.894932
    },
    {
      id: '5e41c9f6d82c451b6859e0c4',
      title: 'Durán',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'duran',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 4.4,
      posY: -80.537749
    },
    {
      id: '5e6874cf8795ae6ed43c68b9',
      title: 'Cuenca',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'cuenca',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 3.4,
      posY: -79.1058965
    },
    {
      id: '5e41c9f7d82c451b6859e692',
      title: 'Macas',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'macas',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 3.7,
      posY: -77.929831
    },
    {
      id: '5e41c9f6d82c451b6859e314',
      title: 'Machala',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'machala',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 2.7,
      posY: -81.260278
    },
    {
      id: '5e41c9f6d82c451b6859e0c5',
      title: 'Loja',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'loja',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 1.8,
      posY: -79.9112769
    },
    {
      id: '5e41c9f6d82c451b6859dfa0',
      title: 'Zamora',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'zamora',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 1.5,
      posY: -79.0503525
    }, {
      id: '5e41c9f5d82c451b6859de78',
      title: 'San Cristobal',
      styleText: { top: '275px', left: '860px', opacity: 0.3 },
      stylePoint: { top: '105px', left: '180px' },
      class: 'san_cristobal',
      hidden: false,
      hasPage: false,
      url: '',
      queryParams: {},
      color: '',
      posX: 8.6,
      posY: -83.300396
    }
  ];

  clasifications: ItemDropdown[] = [];
  clasificationSelectedTitle = '';

  filters: Filters = {
    page: 0,
    limit: 30,
    ascending: true,
    sort: '_id'
  };

  step = 1;
  selectCity: any;
  loadMapp = false;

  clasificationSelected: Clasification;
  tagsButtons: any[] = [];
  tagsResult: ResultList<Tag>;
  @Input() newTag = '';
  stopwords: string[] = [];
  citySelected: any;
  v: any;
  activeCities: ItemDropdown[] = [];
  currentMapp: string = '';

  tagsData: any[] = [];

  @ViewChild('about', { static: false }) about: ElementRef;


  private readonly notifier: NotifierService;

  mapName: string;
  seriesData: any;
  markersData: any[] = [];
  mapOptions: any;
  defaultColors: any = {
    markerColor: '#FAFAFA',      // the marker points
    bgColor: 'transparent',      // the background
    scaleColors: ['#bbd8fc', '#3bcbff', '#3cbeed', '#2c98bf'],    // the color of the region in the serie
    regionFill: '#006685'       // the base region color
  };
  mapHeight: number;

  home: any = [];
  responsiveOptions;


  constructor(
    private clasificationService: ClasificationService,
    private tagsService: TagService,
    private regionService: RegionService,
    private utilService: UtilsService,
    private router: Router,
    notifierService: NotifierService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute
  ) {
    this.notifier = notifierService;


    this.mapName = 'ecuador_provinces';

    this.mapOptions = {
      markerColor: this.defaultColors.markerColor,
      bgColor: this.defaultColors.bgColor,
      scale: 1,
      scaleColors: this.defaultColors.scaleColors,
      regionFill: this.defaultColors.regionFill
    };

    this.seriesData = {
      'EC.GU': 4,
      'EC.ES': 3,
      'EC.CR': 2,
      'EC.IM': 1,
      'EC.SU': 3,
      'EC.SE': 3,
      'EC.SD': 4,
      'EC.AZ': 2,
      'EC.EO': 1,
      'EC.LJ': 3,
      'EC.ZC': 2,
      'EC.CN': 3,
      'EC.BO': 3,
      'EC.CT': 4,
      'EC.LR': 2,
      'EC.MN': 1,
      'EC.CB': 2,
      'EC.MS': 1,
      'EC.PI': 2,
      'EC.PA': 3,
      'EC.1076': 1,
      'EC.NA': 2,
      'EC.TU': 1,
      'EC.GA': 4
    };

    this.cities.forEach(c => {
      if (c.posX && c.posY) {
        this.markersData.push({ latLng: [c.posX, c.posY], name: c.title });
      }
    });

    this.setMapHeight();

  }

  ngOnInit() {

    console.log('TAG', this.newTag);


    if (window.innerWidth > 767) {
      this.translate.onLangChange.subscribe((params: LangChangeEvent) => {
        localStorage.setItem('language', params.lang);
      });
    }

    this.activatedRoute.queryParams.subscribe(params => {
      if (params.city) this.onClickCity(params.city)
    });

    /*let elem: HTMLElement = document.getElementById('navbarMenu');
    elem.style.setProperty("background-color", 'transparent');
    elem.classList.add("fixed-top");
    elem.classList.remove("sticky-top");*/


    this.home = [
      {
        background: 'bg-banner-carousel-2',
        title: 'response_covid',
        subtitle: 'response_covid_description',
        grafico: 'grafico-home2',
        svg: 'assets/home/coronavirus.svg',
        routerLink: '/covid'

      },
      {
        background: 'bg-banner-carousel-1',
        title: 'our_cities',
        subtitle: 'our_cities_description',
        grafico: 'grafico-home1',
        svg: '',
        routerLink: '/thematic'
      },
      {
        background: 'bg-banner-carousel-3',
        title: 'compare_cities',
        subtitle: ' ',
        grafico: 'grafico-home3',
        svg: 'assets/home/ciudades-comparacion.svg',
        routerLink: '/thematic'

      },


    ];

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];





  }

  ngDoCheck() {

    if (this.utilService.itemSelected) {

      setTimeout(() => {
        this.about.nativeElement.scrollIntoView();
        console.log('excute');

      }, 0.000001);

      //console.log(this.utilService.itemSelected);


    }

    this.utilService.itemSelected = undefined;
  }


  /* @HostListener('window:scroll', ['$event'])
   onWindowIndexScroll($event) {
     if ($event.srcElement.scrollingElement.scrollTop > 50)
       this.getCantons();
 
     let elem: HTMLElement = document.getElementById('navbarMenu');
     let pos = window.pageYOffset;
     if (pos > 20)
       elem.style.setProperty("background-color", '#189cff');
     else
       elem.style.setProperty("background-color", 'transparent');
     // else
     // elem.style.setProperty("background-color", 'transparent');
   }*/


  async getCantons() {
    let cantons = localStorage.getItem('cantons');

    if (cantons) {
      this.getParseCities(JSON.parse(cantons));
    }
    else {
      this.regionService.listRegionsPublic(this.filters, 'Canton').subscribe(resp => {
        this.getParseCities(resp);
      });
    }
  }

  getParseCities(cantons) {
    this.activeCities = [];
    cantons.data.forEach(r => {
      this.activeCities.push(
        { id: r._id, name: r.name, check: true, color: r.color }
      );

      this.cities.forEach(c => {
        if (r.name.toLowerCase() === c.title.toLowerCase()) {
          c.id = r._id;
          c.url = '/cities';
          c.queryParams = { city: r._id };
          c.hasPage = true;
          c.color = r.color;
        }
      });
    });
  }

  async onClickCity(id) {
    if (this.stopwords.length == 0) {
      this.getStopwords();
    }

    if (this.activeCities.length == 0)
      await this.getCantons();

    this.step = 2;
    this.listTags(id);
    this.cities.forEach(city => {
      if (city.id === id) {
        this.selectCity = city;
        this.regionService.citySelect = this.selectCity;
      }
    });
  }

  onHidde() {
    this.cities.forEach(city => {
      // city.hidden = true;
    });
  }

  onAddTag(value, type) {

    let words = this.parseStopword(value);
    for (let index = 0; index < words.length; index++) {
      const element = words[index];
      this.tagsService.addTag({ text: element.toLowerCase().trim(), id_Canton: this.selectCity.id, type }).subscribe(data => {
        this.newTag = '';
        this.step = 3;
        if (index + 1 == words.length)
          this.listTags(this.selectCity.id);

      }, err => {
        console.log(err);
      });
    }
  }


  listTags(cityId) {
    this.tagsService.getTagsByCantByType(cityId).pipe(
      map(resp => {
        return resp;
      })
    ).subscribe(resp => {
      this.tagsData = [];
      resp.data.forEach(el => {
        this.tagsData.push({
          text: el._id.toLowerCase(),
          size: el.count//el.count > 10 ? 10 : el.count,
        });
      });

      if (this.step == 3)
        this.newTagCloud();
    });
  }

  getStopwords() {
    this.tagsService.getStopwords().pipe(
      map(resp => {
        return resp;
      })
    ).subscribe(resp => {
      const { data } = resp;
      if (resp.data.length > 0)
        this.stopwords = resp.data[0].stopwords;
    });

  }

  isStopword(sentence) {
    const works = sentence.split(' ');
    const results = [];
    works.forEach(c => {
      const result = this.stopwords.find(x => x == c.toUpperCase().trim());
      if (result != undefined)
        results.push(true)
    });
    return results.length > 0;
  }

  parseStopword(sentence) {
    let finalSentence = [];
    const works = sentence.split(' ');
    works.forEach(c => {
      const result = this.stopwords.find(x => x == c.toUpperCase().trim());
      if (result == undefined)
        finalSentence.push(c.toUpperCase().trim());
    });
    return finalSentence;
  }

  getIdea(tagsData) {
    let text = tagsData[0].text;
    if (tagsData.length == 2)
      text += ` y ${tagsData[1].text}`;
    else if (tagsData.length > 2)
      text += `, ${tagsData[1].text} y ${tagsData[2].text}`;

    return text;
  }

  // onCheckItemClasification(idClasification) {
  //   this.clasifications.forEach(c => {
  //     c.check = false;
  //     if (c.id === idClasification) {
  //       c.check = true;
  //       this.clasificationSelectedTitle = c.name;
  //     }
  //   });
  // }

  goToCity(id) {
    this.router.navigate(['/cities'], { queryParams: { city: id } });
  }

  setMapHeight() {
    if (window.innerWidth <= 375) {
      this.mapHeight = 450;
    }
    else if (window.innerWidth > 375 && window.innerWidth <= 575) {
      this.mapHeight = 450;
    } else if (window.innerWidth > 575 && window.innerWidth <= 767) {
      this.mapHeight = 450;
    }
    else if (window.innerWidth >= 768 && window.innerWidth <= 991) {
      this.mapHeight = 400;
    }
    else if (window.innerWidth >= 992 && window.innerWidth <= 1199) {
      this.mapHeight = 450;
    }
    else if (window.innerWidth >= 1200 && window.innerWidth <= 1380) {
      this.mapHeight = 500;
    }
    else if (window.innerWidth >= 1381 && window.innerWidth <= 1600) {
      this.mapHeight = 550;
    }
    else if (window.innerWidth > 1600) {
      this.mapHeight = 700;
    }
  }

  loadImg() {
    this.loadMapp = true;
  }

  onMarkerClick(event) {
    this.onClickCity(this.cities[event].id);
  }


  newTagCloud() {

    let width = 550;
    let height = 350;
    let maxFont = 96;
    if (window.innerWidth <= 375) {
      width = 300;
      height = 400;
      maxFont = 46;
    }
    else if (window.innerWidth > 375 && window.innerWidth <= 575) {
      width = 400;
      height = 350;
      maxFont = 46;
    } else if (window.innerWidth > 575 && window.innerWidth <= 767) {
      width = 450;
      height = 350;
      maxFont = 46;
    }
    else if (window.innerWidth >= 768 && window.innerWidth <= 991) {
      width = 600;
      height = 200;
      maxFont = 46;
    }
    else if (window.innerWidth >= 992 && window.innerWidth <= 1199) {
      width = 900;
      height = 300;
    }
    else if (window.innerWidth >= 1200 && window.innerWidth <= 1380) {
      width = 900;
      height = 300;
      maxFont = 96;
    }
    else if (window.innerWidth >= 1381 && window.innerWidth <= 1600) {
      width = 1000;
      height = 350;
      maxFont = 96;
    }
    else if (window.innerWidth > 1600) {
      width = 1000;
      height = 370;
      maxFont = 96;
    }

    tagCloud(this.tagsData, width, height, maxFont, 'black');

  }

  changueStep() {
    this.step = 1;
    this.regionService.citySelect = undefined;
  }

}
