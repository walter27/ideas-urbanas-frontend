import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/core/models/filters.model';
import { Observable } from 'rxjs';
import { ResultList } from 'src/app/core/models/resultList.model';
import { FieldsForm } from 'src/app/core/models/fileldsForm.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Region } from 'src/app/core/models/regions.model';
import { RegionService } from 'src/app/core/services/region.service';

@Component({
  selector: 'app-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.scss']
})
export class ProvinceComponent implements OnInit {


  model = 'Province';
  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: '_id'
  };
  result$: Observable<ResultList<Region>>;
  columns = [
    { name: 'name', prop: 'name' },
    { name: 'active', prop: 'active' },
    { name: 'description', prop: 'description' }
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
      label: 'active',
      type: 'switch',
      id: 'active',
      formControlName: 'active',
      required: false
    }
  ];

  // Forms
  addEditForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    active: new FormControl('')
  });

  private readonly notifier: NotifierService;

  search = '';

  constructor(
    private regionService: RegionService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    
    this.listProvinces();
  }

  listProvinces() {
    this.result$ = this.regionService.listRegions(this.filters, this.model, { search: this.search });
  }

  onSubmit(event) {
    if (this.addEditForm.valid) {
      if ( event.action === 'add' ) {
        this.regionService.addRegion(this.addEditForm.value, this.model).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' adicionado correctamente.');
          this.listProvinces();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando adicionar la ' + this.model + '.');
        });
      } else {
        this.regionService.editRegion(this.addEditForm.value, event.id, this.model).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' actualizada correctamente.');
          this.listProvinces();
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
      this.listProvinces();
    }, err => {
      this.notifier.notify('error', 'Ha ocurrido un error intentando eliminar la' + this.model + '.');
    });
  }

  onChangePage(page) {
    this.filters.page = page;
    this.listProvinces();
  }

  onSearch(e) {
    this.search = e;
    this.filters.page = 0;
    this.listProvinces();
  }

}
