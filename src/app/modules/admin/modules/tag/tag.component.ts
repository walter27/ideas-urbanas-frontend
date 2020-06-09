import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/core/models/filters.model';
import { Observable } from 'rxjs';
import { ResultList } from 'src/app/core/models/resultList.model';
import { FieldsForm } from 'src/app/core/models/fileldsForm.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Tag } from 'src/app/core/models/tags.model';
import { TagService } from 'src/app/core/services/tag.service';

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
    { name: 'text', prop: 'text' }
  ];
  fields: FieldsForm[] = [
    {
      label: 'text',
      type: 'text',
      id: 'text',
      formControlName: 'text',
      required: false
    }
  ];

  // Forms
  private readonly notifier: NotifierService;

  search = '';

  constructor(
    private tagService: TagService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    
    this.listTags();
  }

  listTags() {
    this.result$ = this.tagService.listTags(this.filters, { search: this.search });
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
