import { Component, OnInit } from '@angular/core';
import { FieldsForm } from 'src/app/core/models/fileldsForm.model';
import { Observable } from 'rxjs';
import { ResultList } from 'src/app/core/models/resultList.model';
import { Config } from 'src/app/core/models/config.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Filters } from 'src/app/core/models/filters.model';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: '_id'
  };
  result$: Observable<ResultList<Config>>;
  columns = [
    { name: 'name', prop: 'name' },
    { name: 'value', prop: 'value' }
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
      label: 'value',
      type: 'text',
      id: 'value',
      formControlName: 'value',
      required: true
    }
  ];

  // Forms
  addEditForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required])
  });

  private readonly notifier: NotifierService;

  constructor(
    private configService: ConfigService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    
    this.listConfigs();
  }

  listConfigs() {
    this.result$ = this.configService.listConfigs(this.filters);
  }

  onSubmit(event) {
    if (this.addEditForm.valid) {
      if ( event.action === 'add' ) {
        this.configService.addConfig(this.addEditForm.value).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', 'Configuración adicionado correctamente.');
          this.listConfigs();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando adicionar la configuración.');
        });
      } else {
        this.configService.editConfig(this.addEditForm.value, event.id).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', 'Configuración actualizada correctamente.');
          this.listConfigs();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando actualizar la configuración.');
        });
      }
    }
  }

  onDelete(id) {
    this.configService.deleteConfig(id).subscribe(data => {
      this.notifier.notify('success', 'Configuración eliminada correctamente.');
      this.filters.page = 0;
      this.listConfigs();
    }, err => {
      this.notifier.notify('error', 'Ha ocurrido un error intentando eliminar la configuración.');
    });
  }

  onChangePage(page) {
    this.filters.page = page;
    this.listConfigs();
  }

}
