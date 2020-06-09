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
  selector: 'app-parish',
  templateUrl: './parish.component.html',
  styleUrls: ['./parish.component.scss']
})
export class ParishComponent implements OnInit {

  model = 'Parish';
  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: '_id'
  };
  result$: Observable<ResultList<Region>>;
  columns = [
    { name: 'Código', prop: 'code' },
    { name: 'Nombre', prop: 'name' },
    { name: 'Descripción', prop: 'description' },
    { name: 'Cantón', prop: 'obj_Canton.name' }
  ];
  fields: FieldsForm[] = [
    {
      label: 'Código',
      type: 'text',
      id: 'code',
      formControlName: 'code',
      required: true
    },
    {
      label: 'Nombre',
      type: 'text',
      id: 'name',
      formControlName: 'name',
      required: true
    },
    {
      label: 'Descripción',
      type: 'text_area',
      id: 'description',
      formControlName: 'description',
      required: false
    },
    {
      label: 'Cantón',
      type: 'select',
      id: 'id_Canton',
      formControlName: 'id_Canton',
      options: [],
      key: 'obj_Canton',
      required: true
    }
  ];

  // Forms
  addEditForm = new FormGroup({
    code: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    id_Canton: new FormControl('', [Validators.required])
  });

  private readonly notifier: NotifierService;

  constructor(
    private regionService: RegionService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    
    this.listCanton();
    this.listParish();
  }

  listParish() {
    this.result$ = this.regionService.listRegions(this.filters, this.model);
  }

  listCanton() {
    this.regionService.listRegions(this.filters, 'Canton').subscribe( data => {
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

  onSubmit(event) {
    if (this.addEditForm.valid) {
      if (event.action === 'add') {
        this.regionService.addRegion(this.addEditForm.value, this.model).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' adicionado correctamente.');
          this.listParish();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando adicionar la ' + this.model + '.');
        });
      } else {
        this.regionService.editRegion(this.addEditForm.value, event.id, this.model).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' actualizada correctamente.');
          this.listParish();
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
      this.listParish();
    }, err => {
      this.notifier.notify('error', 'Ha ocurrido un error intentando eliminar la' + this.model + '.');
    });
  }

  onChangePage(page) {
    this.filters.page = page;
    this.listParish();
  }

}
