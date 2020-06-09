import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/core/models/filters.model';
import { Observable } from 'rxjs';
import { ResultList } from 'src/app/core/models/resultList.model';
import { Data } from '@angular/router';
import { FieldsForm } from 'src/app/core/models/fileldsForm.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { VariableService } from 'src/app/core/services/variable.service';
import { ClasificationService } from 'src/app/core/services/clasification.service';
import { DataService } from 'src/app/core/services/data.service';
import { RegionService } from 'src/app/core/services/region.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  model = 'Datos';
  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: '_id'
  };
  result$: Observable<ResultList<Data>>;
  columns = [
    { name: 'value', prop: 'value' },
    { name: 'description', prop: 'description' },
    { name: 'year', prop: 'year' },
    { name: 'canton', prop: 'obj_Canton.name' },
    { name: 'variable', prop: 'obj_Variable.name' },
  ];
  fields: FieldsForm[] = [
    {
      label: 'value',
      type: 'number',
      id: 'value',
      formControlName: 'value',
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
      label: 'year',
      type: 'number',
      id: 'year',
      formControlName: 'year',
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
      label: 'variable',
      type: 'select',
      id: 'id_Variable',
      formControlName: 'id_Variable',
      options: [],
      key: 'obj_Variable',
      required: true
    }
  ];

  // Forms
  addEditForm = new FormGroup({
    description: new FormControl(''),
    value: new FormControl('', [Validators.required]),
    year: new FormControl('', [Validators.required]),
    id_Canton: new FormControl('', [Validators.required]),
    id_Variable: new FormControl('', [Validators.required]),
  });

  private readonly notifier: NotifierService;

  search = '';

  constructor(
    private variableService: VariableService,
    private regionService: RegionService,
    private dataService: DataService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    
    this.listVariable();
    this.listCanton();
    this.listData();
  }

  listData() {
    this.result$ = this.dataService.listDatas(this.filters, null, null, this.search);
  }

  listVariable() {
    this.variableService.listVariables(this.filters).subscribe( data => {
      this.fields.forEach( el => {
        if ( el.id === 'id_Variable' ) {
          el.options = [];
          data.data.forEach( p => {
            el.options.push({
              id: p._id,
              text: p.name
            });
          });
        }
      });
    });
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
    });
  }

  onSubmit(event) {
    if (this.addEditForm.valid) {
      if ( event.action === 'add' ) {
        this.dataService.addData( this.addEditForm.value ).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' adicionado correctamente.');
          this.listData();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando adicionar la ' + this.model + '.');
        });
      } else {
        this.dataService.editData(this.addEditForm.value, event.id).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' actualizada correctamente.');
          this.listData();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando actualizar la ' + this.model + '.');
        });
      }
    }
  }

  onDelete(id) {
    this.dataService.deleteData(id).subscribe(data => {
      this.notifier.notify('success', this.model + ' eliminada correctamente.');
      this.filters.page = 0;
      this.listData();
    }, err => {
      this.notifier.notify('error', 'Ha ocurrido un error intentando eliminar la' + this.model + '.');
    });
  }

  onChangePage(page) {
    this.filters.page = page;
    this.listData();
  }

  onSearch(e) {
    this.search = e;
    this.filters.page = 0;
    this.listData();
  }

  onChangeFile(event){
    
  }

  onSortBy(event) {
    console.log(event)
    this.filters.sort = event.prop;
    this.filters.ascending = event.ascending;
    this.result$ = this.dataService.listDatas(this.filters, null, null, this.search);
  }

}
