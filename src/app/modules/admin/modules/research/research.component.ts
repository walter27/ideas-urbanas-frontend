import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/core/models/filters.model';
import { Observable } from 'rxjs';
import { ResultList } from 'src/app/core/models/resultList.model';
import { Research } from 'src/app/core/models/research.model';
import { FieldsForm } from 'src/app/core/models/fileldsForm.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { RegionService } from 'src/app/core/services/region.service';
import { ResearchService } from 'src/app/core/services/research.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})
export class ResearchComponent implements OnInit {

  model = 'Research';
  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: '_id'
  };
  result$: Observable<ResultList<Research>>;
  columns = [
    { name: 'name', prop: 'name', width: '10%' },
    { name: 'description', prop: 'description', width: '60%' },
    { name: 'category', prop: 'category' },
    { name: 'image', prop: 'image_route' },
    { name: 'canton', prop: 'obj_Canton.name' }
  ];
  fields: FieldsForm[] = [
    {
      label: 'name',
      type: 'text',
      id: 'name',
      formControlName: 'name',
      required: true
    },
    {
      label: 'description',
      type: 'text_area',
      id: 'description',
      formControlName: 'description',
      required: false
    },
    {
      label: 'category',
      type: 'select',
      id: 'category',
      formControlName: 'category',
      options: [],
      key: 'category',
      required: true
    },
    {
      label: 'canton',
      type: 'select',
      id: 'id_Canton',
      formControlName: 'id_Canton',
      options: [],
      key: 'obj_Canton',
      required: true
    },
    {
      label: 'image',
      type: 'file',
      id: 'image',
      formControlName: 'image',
      required: true
    }
  ];
  file: any;

  // Forms
  addEditForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    id_Canton: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required])
  });

  private readonly notifier: NotifierService;

  goBack = '';

  constructor(
    private researchService: ResearchService,
    private regionService: RegionService,
    private categoryService: CategoryService,
    notifierService: NotifierService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    
    this.activatedRoute.queryParams.subscribe(params => {
      if ( params.showModal && params.goBack ) {
        this.goBack = params.goBack;
        $('#addEditModal').modal('show');
      }
    });
    this.listResearch();
    this.listCanton();
    this.listCategories();
  }

  listResearch() {
    this.result$ = this.researchService.listResearchs(this.filters);
  }

  listCanton() {
    this.regionService.listRegions({
      page: 0,
      limit: 1000,
      ascending: true,
      sort: '_id'
    }, 'Canton').subscribe( data => {
      this.fields.forEach( el => {
        if ( el.id === 'id_Canton' ) {
          el.options = [];
          data.data.forEach( p => {
            el.options.push({
              id: p._id,
              text: p.name
            });
          });
        }
      });
    } );
  }

  listCategories() {
    this.categoryService.listCategory().subscribe( data => {
      this.fields.forEach( el => {
        if ( el.id === 'category' ) {
          el.options = [];
          data.category.forEach( p => {
            el.options.push({
              id: p,
              text: p
            });
          });
        }
      });
    });
  }

  onSubmit(event) {
    if (this.addEditForm.valid) {
      if ( event.action === 'add' ) {
        this.researchService.addResearch({ ...this.addEditForm.value, image: this.file }).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' adicionado correctamente.');
          if ( this.goBack ) {
            this.router.navigate(['/cities'], { queryParams: {city: this.goBack} });
          } else {
            this.listResearch();
          }
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando adicionar la ' + this.model + '.');
        });
      } else {
        this.researchService.editResearch({ ...this.addEditForm.value, images: this.file }, event.id).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' actualizada correctamente.');
          this.listResearch();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando actualizar la ' + this.model + '.');
        });
      }
    }
  }

  onDelete(id) {
    this.researchService.deleteResearch(id).subscribe(data => {
      this.notifier.notify('success', this.model + ' eliminada correctamente.');
      this.filters.page = 0;
      this.listResearch();
    }, err => {
      this.notifier.notify('error', 'Ha ocurrido un error intentando eliminar la' + this.model + '.');
    });
  }

  onChangePage(page) {
    this.filters.page = page;
    this.listResearch();
  }

  onChangeFile(event) {
    this.file = event;
  }

}
