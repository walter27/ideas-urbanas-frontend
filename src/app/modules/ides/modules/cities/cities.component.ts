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
import { DataService } from 'src/app/core/services/data.service';
let { tagCloud } = require('src/app/core/utils/utils');
const accents = require('remove-accents');

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
  cols: any;

  resultClasification$: any;
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

  indexes: any[] = [];
  indexesCity: any[] = [];


  overVAB = false;
  overPoblacion = false;
  v: Variable;
  imageCity: string;

  constructor(
    private clasificationService: ClasificationService,
    private researchService: ResearchService,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private variableService: VariableService,
    private regionService: RegionService,
    private dataService: DataService,
    private tagsService: TagService,
    private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit() {
    /*let elem: HTMLElement = document.getElementById('navbarMenu');
    elem.style.setProperty("background-color", '#189cff');
    elem.classList.add("sticky-top");
    elem.classList.remove("fixed-top");*/

    this.cols = [
      { field: 'year', header: 'year', width: '3rem' },
      { field: 'title', header: 'title' },
      { field: 'author', header: 'authors' }

    ];

    this.regionService.citySelectedWordCloud = undefined;
    this.regionService.citySelect = undefined;

    this.activatedRoute.queryParams.subscribe(params => {
      this.idCity = params.city;
      this.citySelected = null;
      this.regionService.getRegion(this.idCity, 'Canton').subscribe(resp => {
        this.citySelected = resp;
        this.imageCity = `${accents.remove('assets/cities/all/' + this.citySelected.name.toLowerCase())}.jpg`;
        this.regionService.citySelectedCloud = this.citySelected;
        this.getResearch();
        this.listTags(this.idCity);
        this.getIndexes(this.idCity);
        this.getClasifications();
        this.listCategories();
      });
    });

  }


  getIndexes(idCity) {

    this.dataService.listDataIndexes().subscribe((resp: any) => {

      this.indexes = resp;



      this.indexesCity = this.indexes.filter(indexe => indexe.canton._id === idCity);




    })


  }

  getClasifications() {

    //let finalRes: any = [];
    this.resultClasification$ = this.clasificationService.listClasificationPublic(this.filters).pipe(
      map(resp => {
        this.clasificationSelected = resp.data[0];
        this.getVariables();
        /* for (const thematic of resp.data) {
           thematic.image_active_route = `assets/ICONOS/${thematic.name}.png`;
           thematic.image_route = `assets/ICONOS/${thematic.name}.png`;
           finalRes.push(thematic);
         }*/
        return resp.data;
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
      this.v = this.resultVariables.data[0];
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

    });
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }



  goToHome() {
    this.router.navigate(['/home'], { queryParams: { city: this.citySelected._id } });
  }


  getVariableSelected() {
    //console.log(this.v);

  }

}
