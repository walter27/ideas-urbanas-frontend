import { Component, OnInit } from '@angular/core';
import { ClasificationService } from 'src/app/core/services/clasification.service';
import { Observable } from 'rxjs';
import { ResultList } from 'src/app/core/models/resultList.model';
import { Clasification } from 'src/app/core/models/clasification.model';
import { Filters } from 'src/app/core/models/filters.model';
import { Research } from 'src/app/core/models/research.model';
import { ResearchService } from 'src/app/core/services/research.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/core/services/category.service';
import { Region } from 'src/app/core/models/regions.model';
import { VariableService } from 'src/app/core/services/variable.service';
import { Variable } from 'src/app/core/models/variable.model';
import { RegionService } from 'src/app/core/services/region.service';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { TagService } from 'src/app/core/services/tag.service';
import { Tag } from 'src/app/core/models/tags.model';
import { AuthService } from 'src/app/core/services/auth.service';
let { tagCloud } = require('src/app/core/utils/utils');

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {

  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: 'name'
  };

  items = [];

  resultClasification$: Observable<ResultList<Clasification>>;
  resultResearch$: Observable<ResultList<Research>>;

  clasificationSelected: Clasification;
  citySelected: Region;

  idCity: string;
  categorySelected = '';

  resultVariables: ResultList<Variable>;

  options: CloudOptions = {
    width: 450,
    height: 200,
    overflow: false,
    font: '14px "Noto Sans TC"',
  };

  tagsData: any[] = [];
  tagsResult: ResultList<Tag>;

  overVAB = false;
  overPoblacion = false;
  v: any;

  constructor(
    private clasificationService: ClasificationService,
    private researchService: ResearchService,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private variableService: VariableService,
    private regionService: RegionService,
    private tagsService: TagService,
    private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      this.idCity = params.city;
      this.citySelected = null;
      this.regionService.getRegion(this.idCity, 'Canton').subscribe(resp => {
        this.citySelected = resp;
        this.getResearch();
        this.listTags(this.idCity);
        this.getClasifications();
        this.listCategories();
      });
    });
  }

  getClasifications() {
    this.resultClasification$ = this.clasificationService.listClasification(this.filters).pipe(
      map(resp => {
        this.clasificationSelected = resp.data[0];
        this.getVariables();
        return resp;
      })
    );
  }

  getResearch() {
    this.resultResearch$ = this.researchService.getResearchsByCatAndCant(this.idCity, this.categorySelected);
  }

  listCategories() {
    this.items = [
      {
        name: 'todas',
        active: true
      }
    ];
    this.categoryService.listCategory().subscribe(data => {
      data.category.forEach(element => {
        this.items.push({ name: element, active: false });
      });
    });
  }

  getVariables() {
    this.resultVariables = null;
    this.variableService.getVariablesByClasification(this.clasificationSelected._id).pipe(
      map(resp => {
        return resp;
      })
    ).subscribe(resp => {
      this.resultVariables = resp;
    });
  }

  onSelectCategory(category) {
    this.categorySelected = category.name;
    if (category.name === 'todas') {
      this.categorySelected = '';
    }
    this.items.forEach(i => {
      i.active = false;
      if (i.name === category.name) {
        i.active = true;
      }
    });
    this.getResearch();
  }

  onSelectClasification(clasification) {
    this.clasificationSelected = clasification;
    this.getVariables();
  }

  listTags(cityId) {
    const classTags = ['#F8A901', '#076DCD', '#B5DFFF'];
    this.tagsService.getTagsByCantByType(cityId).pipe(
      map(resp => {
        return resp;
      })
    ).subscribe(resp => {
      this.tagsData = [];
      resp.data.forEach(el => {
        this.tagsData.push({
          text: el._id.toLowerCase(),
          size: el.count, //el.count > 10 ? 10 : el.count,
        });
      });
      this.newTagCloud();
    });
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  newTagCloud() {

    let width = 450;
    let height = 200;
    let maxFont = 96;
    if (window.innerWidth <= 575) {
      width = 350;
      height = 250;
      maxFont = 46;
    } else if (window.innerWidth > 575 && window.innerWidth <= 767) {
      width = 540;
      height = 340;
      maxFont = 46;
    }
    else if (window.innerWidth >= 768 && window.innerWidth <= 991) {
      width = 640;
      height = 350;
      maxFont = 46;
    }
    else if (window.innerWidth >= 992 && window.innerWidth <= 1199) {
      width = 900;
      height = 400;
      maxFont = 96;
    }
    else if (window.innerWidth >= 1200 && window.innerWidth <= 1380) {
      width = 580;
      height = 265;
      maxFont = 96;
    }
    else if (window.innerWidth >= 1381 && window.innerWidth <= 1600) {
      width = 550;
      height = 280;
      maxFont = 96;
    }
    else if (window.innerWidth > 1600) {
      width = 700;
      height = 300;
      maxFont = 96;
    }

    tagCloud(this.tagsData, width, height, maxFont, '#F8A901');
  }

  goToHome() {
    this.router.navigate(['/home'], { queryParams: { city: this.citySelected._id } });
  }

}
