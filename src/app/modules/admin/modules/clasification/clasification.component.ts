import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/core/models/filters.model';
import { Observable } from 'rxjs';
import { ResultList } from 'src/app/core/models/resultList.model';
import { Clasification } from 'src/app/core/models/clasification.model';
import { FieldsForm } from 'src/app/core/models/fileldsForm.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ClasificationService } from 'src/app/core/services/clasification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-clasification',
  templateUrl: './clasification.component.html',
  styleUrls: ['./clasification.component.scss']
})
export class ClasificationComponent implements OnInit {

  model = 'Clasification';
  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: '_id'
  };
  result$: Observable<ResultList<Clasification>>;
  columns = [
    { name: 'name', prop: 'name', width: '10%' },
    { name: 'description', prop: 'description', width: '60%' },
    { name: 'active', prop: 'active' },
    { name: 'image', prop: 'image_route' },
    //{ name: 'active_image', prop: 'image_active_route' },
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
    },
    {
      label: 'image',
      type: 'file',
      id: 'image',
      formControlName: 'image',
      required: false,
      extra: 'image_route'
    },
    /* {
       label: 'active_image',
       type: 'file',
       id: 'image_active',
       formControlName: 'image_active',
       required: true,
       extra: 'image_active_route'
     }*/
  ];

  // Forms
  addEditForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    active: new FormControl(''),
    image: new FormControl(''),
    //image_active: new FormControl('', [Validators.required])
  });

  images = {
    image: null,
    //image_active: null
  };

  private readonly notifier: NotifierService;

  constructor(
    private clasificationService: ClasificationService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {

    this.listClasification();
  }

  listClasification() {
    this.result$ = this.clasificationService.listClasification(this.filters);
  }

  onSubmit(event) {
    if (this.addEditForm.valid) {
      if (event.action === 'add') {
        this.clasificationService.addClasification({ ...this.addEditForm.value, images: this.images }).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' adicionado correctamente.');
          this.listClasification();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando adicionar la ' + this.model + '.');
        });
      } else {
        this.clasificationService.editClasification({ ...this.addEditForm.value, images: this.images }, event.id).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' actualizada correctamente.');
          this.listClasification();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando actualizar la ' + this.model + '.');
        });
      }
    }
  }

  onDelete(id) {
    this.clasificationService.deleteClasification(id).subscribe(data => {
      this.notifier.notify('success', this.model + ' eliminada correctamente.');
      this.filters.page = 0;
      this.listClasification();
    }, err => {
      this.notifier.notify('error', 'Ha ocurrido un error intentando eliminar la' + this.model + '.');
    });
  }

  onChangePage(page) {
    this.filters.page = page;
    this.listClasification();
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
