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
import { ClasificationService } from 'src/app/core/services/clasification.service';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit {

  model = 'Indicators';
  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: '_id'
  };
  result$: Observable<ResultList<Origin>>;
  columns = [
    { name: 'name', prop: 'name' },
    { name: 'description', prop: 'description' },
    { name: 'clasification', prop: 'obj_Clasification.name' },
    { name: 'configs', prop: 'configs' }
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
      label: 'clasification',
      type: 'select',
      id: 'id_Clasification',
      formControlName: 'id_Clasification',
      options: [],
      key: 'obj_Clasification',
      required: true
    },
    {
      label: 'configs',
      type: 'configs',
      id: 'configs',
      formControlName: 'configs',
      required: true
    }
  ];

  // Forms
  addEditForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    id_Clasification: new FormControl('', [Validators.required]),
    configs: new FormControl([[0, 0], [0, 0], [0]], [Validators.required])
  });

  private readonly notifier: NotifierService;

  constructor(
    private indicatorService: IndicatorService,
    private clasification: ClasificationService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    
    this.listIndicators();
    this.listClasification();
  }

  listIndicators() {
    this.result$ = this.indicatorService.listIndicators(this.filters);
  }

  listClasification() {
    this.clasification.listClasification({ page: 0, limit: 1000, ascending: true, sort: 'name' }).subscribe( data => {
      this.fields.forEach( el => {
        if ( el.id === 'id_Clasification' ) {
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
