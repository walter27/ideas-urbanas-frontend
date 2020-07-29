import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/core/models/filters.model';
import { Observable } from 'rxjs';
import { ResultList } from 'src/app/core/models/resultList.model';
import { Region } from 'src/app/core/models/regions.model';
import { FieldsForm } from 'src/app/core/models/fileldsForm.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { RegionService } from 'src/app/core/services/region.service';

@Component({
  selector: 'app-canton',
  templateUrl: './canton.component.html',
  styleUrls: ['./canton.component.scss']
})
export class CantonComponent implements OnInit {

  model = 'Canton';
  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: '_id'
  };
  result$: Observable<ResultList<Region>>;
  columns = [
    { name: 'name', prop: 'name' },
    { name: 'code', prop: 'code' },
    { name: 'url', prop: 'url' },
    { name: 'active', prop: 'active' },
    { name: 'description', prop: 'description' },
    { name: 'province', prop: 'obj_Provincia.name' }
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
      label: 'code',
      type: 'text',
      id: 'code',
      formControlName: 'code',
      required: true
    },
    {
      label: 'url',
      type: 'text',
      id: 'url',
      formControlName: 'url',
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
      label: 'active',
      type: 'switch',
      id: 'active',
      formControlName: 'active',
      required: false
    },
    {
      label: 'color',
      type: 'color_picker',
      id: 'color',
      formControlName: 'color',
      required: false
    },
    {
      label: 'province',
      type: 'select',
      id: 'id_Provincia',
      formControlName: 'id_Provincia',
      options: [],
      key: 'obj_Provincia',
      required: true
    }
  ];

  // Forms
  addEditForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    active: new FormControl(''),
    id_Provincia: new FormControl('', [Validators.required]),
    color: new FormControl(''),
  });

  search = '';

  private readonly notifier: NotifierService;

  constructor(
    private regionService: RegionService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    
    this.listProvinces();
    this.listCanton();
  }

  listCanton() {
    this.result$ = this.regionService.listRegions(this.filters, this.model, { search: this.search });
  }

  listProvinces() {
    this.regionService.listRegions({ page: 0, limit: 1000, ascending: true, sort: '_id' }, 'Province').subscribe( data => {
      this.fields.forEach( el => {
        if ( el.id === 'id_Provincia' ) {
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

  onSubmit(event) {

    console.log(event);
    
    if (this.addEditForm.valid) {
      if (event.action === 'add') {
        this.regionService.addRegion(this.addEditForm.value, this.model).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' adicionado correctamente.');
          this.listCanton();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando adicionar la ' + this.model + '.');
        });
      } else {
        this.regionService.editRegion(this.addEditForm.value, event.id, this.model).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' actualizada correctamente.');
          this.listCanton();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando actualizar la ' + this.model + '.');
        });
      }
    }
  }

  onDelete(id) {
    this.regionService.deleteRegion(id, this.model).subscribe(data => {
      this.notifier.notify('success', this.model + ' eliminada correctamente.');
      this.filters.page = 0;
      this.listCanton();
    }, err => {
      this.notifier.notify('error', 'Ha ocurrido un error intentando eliminar la' + this.model + '.');
    });
  }

  onChangePage(page) {
    this.filters.page = page;
    this.listCanton();
  }

  onSearch(e) {
    this.search = e;
    this.filters.page = 0;
    this.listCanton();
  }

}
