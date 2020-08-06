import { Component, OnInit } from '@angular/core';
import { RegionService } from '../core/services/region.service';
import { Observable } from 'rxjs';
import { ResultList } from '../core/models/resultList.model';
import { Region } from '../core/models/regions.model';
import { Filters } from '../core/models/filters.model';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

interface ItemsDrop {
  id: string;
  title: string;
  type: string;
  url?: string;
  options?: Array<any>;
  onlyAdmin?: boolean;
  active: boolean;
  amountToShow?: number;
}

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {

  model = 'Canton';
  filters: Filters = {
    page: 0,
    limit: 100,
    ascending: true,
    sort: '_id'
  };

  items: Array<ItemsDrop> = [

    {
      id: 'home',
      title: 'home',
      type: 'text',
      url: '/home',
      active: false
    },
    {
      id: 'about',
      title: 'about',
      type: 'text',
      url: '/home',
      active: false
    },
    {
      id: 'intermediate_city',
      title: 'intermediate_city',
      type: 'drop',
      options: [
        {
          id: 'say',
          text: 'say',
          url: '/intermediate-cities',
        },
        {
          id: 'indexes',
          text: 'indexes',
          url: '/indexes',
        },
        {
          id: 'thematics',
          text: 'thematics',
          url: '/thematic',
        },
        {
          id: 'discover',
          text: 'discover',
          url: '/intermediate-cities',
        }
      ],
      url: '/intermediate-cities',
      active: false
    },
    /*{
      id: 'cities',
      title: 'cities',
      type: 'drop',
      options: [],
      url: '/cities',
      active: false
    },*/
    {
      id: 'citizen_reports',
      title: 'citizen_reports_start',
      type: 'text',
      url: '/citizen-reports',
      active: false
    },
    {
      id: 'covid',
      title: 'response_covid_start',
      type: 'text',
      url: '/covid',
      active: false
    },
    {
      id: 'admin',
      title: 'Administración',
      type: 'drop',
      active: false,
      options: [
        {
          id: 'user',
          text: 'models.user',
          url: '/admin/users'
        },
        {
          id: 'config',
          text: 'models.configuration',
          url: '/admin/config'
        },
        {
          id: 'province',
          text: 'models.province',
          url: '/admin/province'
        },
        {
          id: 'canton',
          text: 'models.canton',
          url: '/admin/canton'
        },
        {
          id: 'research',
          text: 'models.research',
          url: '/admin/research'
        },
        {
          id: 'origin',
          text: 'models.origin',
          url: '/admin/origin'
        },
        {
          id: 'clasification',
          text: 'models.clasification',
          url: '/admin/clasification'
        },
        {
          id: 'variable',
          text: 'models.variable',
          url: '/admin/variable'
        },
        {
          id: 'data',
          text: 'models.data',
          url: '/admin/data'
        },
        {
          id: 'citizen-reports',
          text: 'models.reports',
          url: '/admin/citizen-reports'
        },
        {
          id: 'indicator',
          text: 'models.indicators',
          url: '/admin/indicator'
        }
        ,
        {
          id: 'tag',
          text: 'models.tag',
          url: '/admin/tag'
        },
        {
          id: 'words',
          text: 'models.stopwords',
          url: '/admin/stopwords'
        }
      ],
      onlyAdmin: true
    }
  ];

  result$: Observable<ResultList<Region>>;

  language = '';

  constructor(
    private regionService: RegionService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.listCanton();
    this.language = sessionStorage.getItem('language');
    if (this.language) {
      this.onSetLanguage(this.language);
    } else {
      this.onSetLanguage('es');
      this.language = 'es';
    }
  }

  listCanton() {
    this.regionService.listRegionsPublic(this.filters, this.model).subscribe(data => {
      localStorage.setItem('cantons', JSON.stringify(data));
      this.items.forEach(i => {
        if (i.title === 'cities') {
          data.data.forEach(el => {
            i.options.push({
              id: el._id,
              text: el.name,
              url: '/cities',
              queryParams: { city: el._id }
            });
          });
        }
      });
    });
  }

  onSetLanguage(l) {
    this.language = l;
    this.translate.use(this.language);
    sessionStorage.setItem('language', this.language);
  }

  onShowMore(e) {
    this.items.forEach(i => {
      if (i.id === e.id) {
        i.amountToShow += e.cant;
      }
    });
  }

}
