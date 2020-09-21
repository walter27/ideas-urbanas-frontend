import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/core/models/filters.model';
import { Observable } from 'rxjs';
import { ResultList } from 'src/app/core/models/resultList.model';
import { Origin } from 'src/app/core/models/origin.model';
import { FieldsForm } from 'src/app/core/models/fileldsForm.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { OriginService } from 'src/app/core/services/origin.service';
import { IndicatorService } from 'src/app/core/services/indicator.service';
import { VariableService } from 'src/app/core/services/variable.service';
import { RegionService } from 'src/app/core/services/region.service';
import { Data } from '@angular/router';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit {

  model = 'Indicators';
  filters: Filters = {
    page: 0,
    limit: 100,
    ascending: true,
    sort: '_id'
  };
  result$: Observable<ResultList<Data>>;
  columns = [
    { name: 'variable', prop: 'obj_Variable.name' },
    { name: 'canton', prop: 'obj_Canton.name' },
    { name: 'ridit', prop: 'ridit' },
    { name: 'ridit', prop: 'ridit_normalize' },
    { name: 'year', prop: 'year' }

  ];
  fields: FieldsForm[] = [
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
    },
    {
      label: 'ridit',
      type: 'number',
      id: 'ridit',
      formControlName: 'ridit',
      required: true
    },
    {
      label: 'ridit_normalize',
      type: 'number',
      id: 'ridit_normalize',
      formControlName: 'ridit_normalize',
      required: true
    },
    {
      label: 'year',
      type: 'number',
      id: 'year',
      formControlName: 'year',
      required: true
    },
  ];

  // Forms
  addEditForm = new FormGroup({
    id_Canton: new FormControl('', [Validators.required]),
    id_Variable: new FormControl('', [Validators.required]),
    ridit: new FormControl(''),
    ridit_normalize: new FormControl(''),
    year: new FormControl('', [Validators.required]),
  });

  private readonly notifier: NotifierService;

  constructor(
    private indicatorService: IndicatorService,
    private variableService: VariableService,
    private regionService: RegionService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {

    this.listVariable();
    this.listCanton();
    this.listIndicators();
  }


  listVariable() {
    this.variableService.listVariables(this.filters).subscribe(data => {
      this.fields.forEach(el => {
        if (el.id === 'id_Variable') {
          el.options = [];
          data.data.forEach(p => {
            if (p.is_indice) {
              el.options.push({
                id: p._id,
                text: p.name
              });
            }
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
    }, 'Canton').subscribe(data => {
      this.fields.forEach(el => {
        if (el.id === 'id_Canton') {
          el.options = [];
          data.data.forEach(p => {

            if (p.is_intermediate) {


              el.options.push({
                id: p._id,
                text: p.name
              });
            }

          });
        }
      });
    });
  }

  listIndicators() {
    this.result$ = this.indicatorService.listIndicators(this.filters);
  }



  onSubmit(event) {
    if (this.addEditForm.valid) {
      if (event.action === 'add') {
        this.indicatorService.addIndicator(this.addEditForm.value).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' adicionado correctamente.');
          this.listIndicators();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando adicionar la ' + this.model + '.');
        });
      } else {
        this.indicatorService.editIndicator(this.addEditForm.value, event.id).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' actualizada correctamente.');
          this.listIndicators();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando actualizar la ' + this.model + '.');
        });
      }
    }
  }

  onDelete(id) {
    this.indicatorService.deleteIndicator(id).subscribe(data => {
      this.notifier.notify('success', this.model + ' eliminada correctamente.');
      this.filters.page = 0;
      this.listIndicators();
    }, err => {
      this.notifier.notify('error', 'Ha ocurrido un error intentando eliminar la' + this.model + '.');
    });
  }

  onChangePage(page) {
    this.filters.page = page;
    this.listIndicators();
  }

}
