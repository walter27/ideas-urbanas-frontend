import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/core/models/filters.model';
import { Observable } from 'rxjs';
import { ResultList } from 'src/app/core/models/resultList.model';
import { FieldsForm } from 'src/app/core/models/fileldsForm.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Tag } from 'src/app/core/models/tags.model';
import { TagService } from 'src/app/core/services/tag.service';
import { RegionService } from 'src/app/core/services/region.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {


  model = 'Tag';
  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: '_id'
  };
  result$: Observable<ResultList<Tag>>;
  columns = [
    { name: 'text', prop: 'text' },
    { name: 'canton', prop: 'obj_Canton.name' },
    { name: 'type', prop: 'type' },

  ];
  fields: FieldsForm[] = [
    {
      label: 'text',
      type: 'text',
      id: 'text',
      formControlName: 'text',
      required: true
    },
    {
      label: 'type',
      type: 'select',
      id: 'type',
      formControlName: 'type',
      options: [
        {
          id: 'positive',
          text: 'positive'
        },
        {
          id: 'negative',
          text: 'negative'
        },
        {
          id: 'neutro',
          text: 'neutro'
        }
      ],
      key: 'type',
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
  ];

  // Forms
  addEditForm = new FormGroup({
    text: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    id_Canton: new FormControl('', [Validators.required]),
  });


  private readonly notifier: NotifierService;

  search = '';

  constructor(
    private tagService: TagService,
    private regionService: RegionService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {

    this.listCanton();
    this.listTags();

  }

  listTags() {
    this.result$ = this.tagService.listTags(this.filters, { search: this.search });
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
      if (event.action === 'add') {
        this.tagService.addTag(this.addEditForm.value).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' adicionado correctamente.');
          this.listTags();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando adicionar la ' + this.model + '.');
        });
      } else {
        this.tagService.editTag(this.addEditForm.value, event.id, this.model).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' actualizada correctamente.');
          this.listTags();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando actualizar la ' + this.model + '.');
        });
      }
    }
  }

  onDelete(id) {

    this.tagService.deleteTag(id).subscribe(data => {
      this.notifier.notify('success', this.model + ' eliminada correctamente.');
      this.filters.page = 0;
      this.listTags();
    }, err => {
      this.notifier.notify('error', 'Ha ocurrido un error intentando eliminar la' + this.model + '.');
    });
  }

  onChangePage(page) {
    this.filters.page = page;
    this.listTags();
  }

  onSearch(e) {
    this.search = e;
    this.filters.page = 0;
    this.listTags();
  }

}
