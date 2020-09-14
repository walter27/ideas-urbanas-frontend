import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/core/models/filters.model';
import { Observable } from 'rxjs';
import { ResultList } from 'src/app/core/models/resultList.model';
import { Variable } from 'src/app/core/models/variable.model';
import { FieldsForm } from 'src/app/core/models/fileldsForm.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { VariableService } from 'src/app/core/services/variable.service';
import { ClasificationService } from 'src/app/core/services/clasification.service';
import { CHAR_TYPE } from './data/char_type.data';
import { OriginService } from 'src/app/core/services/origin.service';
import { ChartsService } from 'src/app/core/services/charts.service';

@Component({
  selector: 'app-variable',
  templateUrl: './variable.component.html',
  styleUrls: ['./variable.component.scss']
})
export class VariableComponent implements OnInit {

  model = 'Variable';
  filters: Filters = {
    page: 0,
    limit: 30,
    ascending: true,
    sort: '_id'
  };
  result$: Observable<ResultList<Variable>>;
  columns = [
    { name: 'name', prop: 'name', width: '10%' },
    { name: 'description', prop: 'description', width: '60%' },
    { name: 'type', prop: 'type' },
    { name: 'chart_type', prop: 'chart_type' },
    { name: 'clasification', prop: 'obj_Clasification.name' },
    //{ name: 'origin', prop: 'origins', text: 'name' },
    { name: 'active', prop: 'active' },
    { name: 'is_indice', prop: 'is_indice' },
    { name: 'image', prop: 'image_route' },


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
      label: 'type',
      type: 'select',
      id: 'type',
      formControlName: 'type',
      options: [
        {
          id: 'cuantitativa',
          text: 'cuantitativa'
        },
        {
          id: 'cualitativa',
          text: 'cualitativa'
        }
      ],
      key: 'type',
      required: true
    },
    {
      label: 'chart_type',
      type: 'select',
      id: 'chart_type',
      formControlName: 'chart_type',
      options: [],
      key: 'chart_type',
      required: true
    },
    {
      label: 'clasification',
      type: 'select',
      id: 'id_Clasification',
      formControlName: 'id_Clasification',
      options: [],
      key: 'obj_Clasification',
      required: true
    },
    {
      label: 'origin',
      type: 'select_multiple',
      id: 'origins',
      formControlName: 'origins',
      options: [],
      key: 'origins',
      required: true
    },
    {
      label: 'active',
      type: 'switch',
      id: 'active',
      formControlName: 'active',
      required: false
    },
    {
      label: 'is_indice',
      type: 'switch',
      id: 'is_indice',
      formControlName: 'is_indice',
      required: false
    },
    {
      label: 'values_indice',
      type: 'values_indice',
      id: 'values_indice',
      formControlName: 'values_indice',
      required: false
    },
    {
      label: 'image',
      type: 'file',
      id: 'image',
      formControlName: 'image',
      required: false,
      extra: 'image_route'

    }
  ];

  images = {
    image: null
  };

  // Forms
  addEditForm = new FormGroup({
    description: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    chart_type: new FormControl('', [Validators.required]),
    id_Clasification: new FormControl('', [Validators.required]),
    origins: new FormControl('', [Validators.required]),
    active: new FormControl(''),
    is_indice: new FormControl(''),
    values_indice: new FormControl(''),
    image: new FormControl('')



  });

  private readonly notifier: NotifierService;

  constructor(
    private variableService: VariableService,
    private clasificationService: ClasificationService,
    private originService: OriginService,
    private chartsService: ChartsService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {

    this.listVariable();
    this.listClasification();
    this.listOrigin();
    this.listCharts();
  }

  listVariable() {
    this.result$ = this.variableService.listVariables(this.filters);
  }

  listClasification() {
    this.filters.sort = 'name';
    this.clasificationService.listClasification(this.filters).subscribe(data => {
      this.fields.forEach(el => {
        if (el.id === 'id_Clasification') {
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

  listOrigin() {
    this.originService.listOrigins(this.filters).subscribe(data => {
      this.fields.forEach(el => {
        if (el.id === 'origins') {
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

  listCharts() {
    this.chartsService.listCharts().subscribe(data => {
      this.fields.forEach(el => {
        if (el.id === 'chart_type') {
          el.options = [];
          data.charts.forEach(p => {
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
        this.variableService.addVariable({ ...this.addEditForm.value, images: this.images }).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' adicionado correctamente.');
          this.listVariable();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando adicionar la ' + this.model + '.');
        });
      } else {
        this.variableService.editVariable({ ...this.addEditForm.value, images: this.images }, event.id).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' actualizada correctamente.');
          this.listVariable();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando actualizar la ' + this.model + '.');
        });
      }
    }
  }

  onDelete(id) {
    this.variableService.deleteVariable(id).subscribe(data => {
      this.notifier.notify('success', this.model + ' eliminada correctamente.');
      this.filters.page = 0;
      this.listVariable();
    }, err => {
      this.notifier.notify('error', 'Ha ocurrido un error intentando eliminar la' + this.model + '.');
    });
  }

  onChangePage(page) {
    this.filters.page = page;
    this.listVariable();
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

}
