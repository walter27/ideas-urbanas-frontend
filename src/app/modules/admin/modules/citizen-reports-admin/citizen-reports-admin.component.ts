import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/core/models/filters.model';
import { Observable } from 'rxjs';
import { ResultList } from 'src/app/core/models/resultList.model';
import { Clasification } from 'src/app/core/models/clasification.model';
import { FieldsForm } from 'src/app/core/models/fileldsForm.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ClasificationService } from 'src/app/core/services/clasification.service';
import { CitizenReports } from 'src/app/core/models/citizen-reports.model';
import { CitizenReportsService } from 'src/app/core/services/citizen-reports.service';

@Component({
  selector: 'app-citizen-reports-admin',
  templateUrl: './citizen-reports-admin.component.html',
  styleUrls: ['./citizen-reports-admin.component.scss']
})
export class CitizenReportsAdminComponent implements OnInit {

  model = 'Reports';
  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: '_id'
  };
  result$: Observable<ResultList<CitizenReports>>;
  columns = [
    { name: 'name', prop: 'name', width: '10%' },
    { name: 'description', prop: 'description', width: '60%' },
    { name: 'image', prop: 'image_route' }
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
      label: 'image',
      type: 'file',
      id: 'image',
      formControlName: 'image',
      required: false,
      extra: 'image_route'

    }
  ];

  // Forms
  addEditForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    image: new FormControl('')
  });

  images = {
    image: null
  };

  private readonly notifier: NotifierService;

  constructor(
    private clasificationService: ClasificationService,
    private reportsService: CitizenReportsService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {

    this.listReports();
  }

  listReports() {
    this.result$ = this.reportsService.listReports(this.filters);
  }

  onSubmit(event) {
    if (this.addEditForm.valid) {
      if (event.action === 'add') {
        this.reportsService.addReports({ ...this.addEditForm.value, images: this.images }).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' adicionado correctamente.');
          this.listReports();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando adicionar la ' + this.model + '.');
        });
      } else {
        this.reportsService.editReports({ ...this.addEditForm.value, images: this.images }, event.id).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' actualizada correctamente.');
          this.listReports();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando actualizar la ' + this.model + '.');
        });
      }
    }
  }

  onDelete(id) {
    this.reportsService.deleteReports(id).subscribe(data => {
      this.notifier.notify('success', this.model + ' eliminada correctamente.');
      this.filters.page = 0;
      this.listReports();
    }, err => {
      this.notifier.notify('error', 'Ha ocurrido un error intentando eliminar la' + this.model + '.');
    });
  }

  onChangePage(page) {
    this.filters.page = page;
    this.listReports();
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
