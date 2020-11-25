import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/core/models/filters.model';
import { Observable } from 'rxjs';
import { ResultList } from 'src/app/core/models/resultList.model';
import { FieldsForm } from 'src/app/core/models/fileldsForm.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Word } from 'src/app/core/models/wordTag.model';
import { TagService } from 'src/app/core/services/tag.service';
import { RegionService } from 'src/app/core/services/region.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {


  model = 'Word';
  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: 'name'
  };
  result$: Observable<ResultList<Word>>;
  columns = [
    { name: 'text', prop: 'text' },
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
    }
  ];

  // Forms
  addEditForm = new FormGroup({
    text: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
  });


  private readonly notifier: NotifierService;

  search = '';

  constructor(
    private tagService: TagService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {

    this.listWords();

  }

  listWords() {
    this.result$ = this.tagService.listWords(this.filters, { search: this.search });
  }


  onSubmit(event) {
    if (this.addEditForm.valid) {
      if (event.action === 'add') {
        this.tagService.addWord(this.addEditForm.value).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' adicionado correctamente.');
          this.listWords();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando adicionar la ' + this.model + '.');
        });
      } else {
        this.tagService.editWord(this.addEditForm.value, event.id).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', this.model + ' actualizada correctamente.');
          this.listWords();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando actualizar la ' + this.model + '.');
        });
      }
    }
  }

  onDelete(id) {

    this.tagService.deleteWord(id).subscribe(data => {
      this.notifier.notify('success', this.model + ' eliminada correctamente.');
      this.filters.page = 0;
      this.listWords();
    }, err => {
      this.notifier.notify('error', 'Ha ocurrido un error intentando eliminar la' + this.model + '.');
    });
  }

  onChangePage(page) {
    this.filters.page = page;
    this.listWords();
  }

  onSearch(e) {
    this.search = e;
    this.filters.page = 0;
    this.listWords();
  }

}
