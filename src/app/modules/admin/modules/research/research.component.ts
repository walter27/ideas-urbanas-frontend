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
import { DataService } from 'src/app/core/services/data.service';
import { Region } from 'src/app/core/models/regions.model';

declare var $: any;

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})
export class ResearchComponent implements OnInit {

  data: any = [];

  model = 'Research';
  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: '_id'
  };
  result$: Observable<ResultList<Research>>;
  columns = [
    { name: 'title', prop: 'title', width: '60%' },
    { name: 'author', prop: 'author', width: '60%' },
    { name: 'year', prop: 'year' },
    { name: 'link', prop: 'link' },
    { name: 'category', prop: 'category' },
    //{ name: 'image', prop: 'image_route' },
    { name: 'canton', prop: 'obj_Canton.name' }
  ];
  fields: FieldsForm[] = [
    {
      label: 'title',
      type: 'text',
      id: 'title',
      formControlName: 'title',
      required: true
    },
    {
      label: 'author',
      type: 'text',
      id: 'author',
      formControlName: 'author',
      required: true
    },
    {
      label: 'year',
      type: 'text',
      id: 'year',
      formControlName: 'year',
      required: true
    },
    {
      label: 'link',
      type: 'text',
      id: 'link',
      formControlName: 'link',
      required: true
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
    /* {
       label: 'image',
       type: 'file',
       id: 'image',
       formControlName: 'image',
       required: false,
       extra: 'image_route'
 
     }*/
  ];
  images = {
    image: null
  };

  // Forms
  addEditForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    author: new FormControl('', [Validators.required]),
    year: new FormControl('', [Validators.required]),
    link: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    id_Canton: new FormControl('', [Validators.required]),
    //image: new FormControl('')
  });

  private readonly notifier: NotifierService;

  goBack = '';

  constructor(
    private researchService: ResearchService,
    private regionService: RegionService,
    private dataService: DataService,
    private categoryService: CategoryService,
    notifierService: NotifierService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {

    //this.loadData();


    this.activatedRoute.queryParams.subscribe(params => {
      if (params.showModal && params.goBack) {
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
    }, 'Canton').subscribe(data => {
      this.fields.forEach(el => {
        if (el.id === 'id_Canton') {
          el.options = [];
          data.data.forEach(p => {
            el.options.push({
              id: p._id,
              text: p.name
            });
          });
        }
      });
    });
  }

  listCategories() {
    this.categoryService.listCategory().subscribe(data => {
      this.fields.forEach(el => {
        if (el.id === 'category') {
          el.options = [];
          data.category.forEach(p => {
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
      if (event.action === 'add') {
        this.researchService.addResearch({ ...this.addEditForm.value, images: this.images }).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' adicionado correctamente.');
          if (this.goBack) {
            this.router.navigate(['/cities'], { queryParams: { city: this.goBack } });
          } else {
            this.listResearch();
          }
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando adicionar la ' + this.model + '.');
        });
      } else {
        this.researchService.editResearch({ ...this.addEditForm.value, images: this.images }, event.id).subscribe(data => {
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
    this.fields.forEach((value) => {
      if (value.id === event.id) {
        value.value = event.File.name;
      }
    });
    this.images[event.id] = event.File;
    this.addEditForm.controls[event.id].setValue(event.File.name);
  }


  loadData() {


    this.regionService.listRegions({
      page: 0,
      limit: 1000,
      ascending: true,
      sort: '_id'
    }, 'Canton').subscribe(async canton => {


      this.savedata(canton.data)




    });



  }


  savedata(catones: any) {

    this.dataService.getData().subscribe((data: any) => {
      // console.log(data);

      data.forEach(data1 => {




        let nuevo = {
          author: data1.autor,
          category: 'academica',
          id_Canton: '',
          link: data1.link,
          title: data1.titulo,
          year: data1.year
        }


        catones.forEach(element => {


          if (element.code === data1.id_region) {

            nuevo.id_Canton = element._id;
          }



        });


        this.data.push(nuevo);



      });


      //console.log(this.data);




      /*for (let i = 0; i < this.data.length; i++) {

        if (i > 21042 && i <= 24048) {

          setTimeout(() => {
            this.researchService.addResearch(this.data[i]).subscribe(resp => {
              console.log(resp, i);

            })
          }, 2000);



        }

      }*/



    });




  }



}
