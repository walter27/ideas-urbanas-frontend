import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { $$, element } from 'protractor';
import { Filters } from 'src/app/core/models/filters.model';
import { FormControl } from '@angular/forms';
import { FieldsForm } from 'src/app/core/models/fileldsForm.model';
declare var $: any;

@Component({
  selector: 'app-ides-datatable',
  templateUrl: './ides-datatable.component.html',
  styleUrls: ['./ides-datatable.component.scss']
})
export class IdesDatatableComponent implements OnInit {

  @Input() items;
  @Input() columns;
  @Input() addEditForm;
  @Input() model;
  @Input() fields: FieldsForm[];
  @Input() showSearch = false;
  @Input() amountToShow = 10;
  @Output() delete = new EventEmitter<string>();
  @Output() changePage = new EventEmitter<number>();
  @Output() submitForm = new EventEmitter<any>();
  @Output() changeFile = new EventEmitter<any>();
  @Output() search = new EventEmitter<any>();
  @Output() sortBy = new EventEmitter<any>();
  @Input() showAdd = true;

  itemSelected: any;
  action = 'add';
  textSearch = '';
  color = '';

  constructor() { }

  ngOnInit() { }

  onConfirmDelete(item) {
    this.itemSelected = item;
    $('#confirmModal').modal('show');
  }

  onDelete() {
    this.delete.emit(this.itemSelected._id);
    $('#confirmModal').modal('hide');
  }

  getPagination(currentPage, totalPages, totalDocs) {
    const solve = [];
    for (let i = currentPage - 3; i <= currentPage; i++) {
      if (i >= 0) {
        solve.push(i);
      }
    }

    for (let i = currentPage + 1; i <= currentPage + 3; i++) {
      if (i < totalPages) {
        solve.push(i);
      }
    }
    return solve;
  }

  onChangePage(p, currentPage, totalPages) {
    if (p !== currentPage && p >= 0 && p < totalPages) {
      this.changePage.emit(p);
    }
  }

  addItem() {
    this.fields.forEach(f => {
      if (f.value) {
        f.value = '';
      }
    });
    this.action = 'add';
    this.addEditForm.reset();
    $('#addEditModal').modal('show');
  }

  onEdit(item) {

    this.addEditForm.reset();
    this.action = 'edit';
    this.itemSelected = item;
    this.fields.forEach((e: any) => {
      if (this.addEditForm.controls[e.id]) {
        let value = item[e.id];
        if (e.type === 'select') {
          if (this.itemSelected[e.key]._id) {
            value = this.itemSelected[e.key]._id;
          }
        } else if (e.type === 'select_multiple') {
          value = [];
          this.itemSelected[e.key].forEach(el => {
            value.push(el._id);
          });
        } else if (e.type === 'configs') {
          value = this.itemSelected[e.id];
        } else if (e.type === 'file' && e.extra) {
          value = this.itemSelected[e.extra];
          e.value = value;
        }
        this.addEditForm.controls[e.id].setValue(value);
      }
    });
    $('#addEditModal').modal('show');
  }

  onSubmit(event) {
    if (this.addEditForm.valid) {
      $('#addEditModal').modal('hide');
      if (this.action === 'edit') {
        this.submitForm.emit({
          action: this.action,
          id: this.itemSelected._id
        });
      } else {
        this.submitForm.emit({
          action: this.action
        });
      }
    }
  }

  getValue(i, prop, text) {

    //console.log(i);

    let solve = i;

    const t = prop.split('.');

    t.forEach(e => {
      solve = solve[e];
    });



    if (solve && typeof (solve) === 'object') {

      if (solve instanceof Array) {

        solve.forEach(data => {

          solve = data.name;


          return solve;


        });

      }



      // solve.forEach((e, idx) => {
      //   if (idx !== 0) {
      //     resp += ', ';
      //   }
      //   resp += e[text];
      // });
      // return resp;
    }

    return solve;
  }

  onChangeFile(id, event) {
    this.changeFile.emit({ id, File: event.target.files[0] });
  }

  getMinValue(a, b) {
    return Math.min(a, b);
  }

  cpInputChange(id, event) {
    this.addEditForm.value.color = event;
  }

  onSortBy(event) {
    event.ascending = event.ascending ? !event.ascending : true;
    this.sortBy.emit(event);
  }


}
