import { Component, OnInit, forwardRef } from '@angular/core';
import { Value } from '../../core/models/valuesIndice.model';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';



@Component({
  selector: 'app-ides-datatable-valuesindice',
  templateUrl: './ides-datatable-valuesindice.component.html',
  styleUrls: ['./ides-datatable-valuesindice.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdesDatatableValuesindiceComponent),
      multi: true
    }
  ]
})
export class IdesDatatableValuesindiceComponent implements OnInit, ControlValueAccessor {

  cols: any;
  listValues: any[] = [];
  onChange: (_: any) => void;
  onTouched: () => void;
  disabled: boolean;
  value: Value;
  displayDialog: boolean;
  displayModal: boolean;


  constructor() { }

  ngOnInit() {
    this.cols = [
      { field: 'year', header: 'year' },
      { field: 'value', header: 'value' },
      { field: 'action', header: 'actions' }


    ];
  }

  writeValue(values: any): void {


    if (values && values.length > 0) {

      this.listValues = values;

    } else {
      this.listValues = [];
    }

  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
    //throw new Error("Method not implemented.");
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
    //throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    //throw new Error("Method not implemented.");
  }

  addvalue() {
    this.value = {
      id: '',
      year: '',
      value: ''
    };
    this.displayDialog = true;

  }

  editValue(value: Value) {
    this.value = { ...value };
    this.displayDialog = true;
  }

  deleteValue(value: Value) {
    this.value = value;
    this.displayModal = true;
  }

  onDelete() {
    this.listValues = this.listValues.filter(value => value.id !== this.value.id);
    this.displayModal = false;
    this.onTouched();
    this.onChange(this.listValues);
  }

  saveValue() {
    if (this.value.id) {
      this.listValues[this.findIndexById(this.value.id)] = this.value;
    } else {

      this.value.id = this.createId();
      this.listValues.push(this.value);

    }

    this.listValues = [...this.listValues];
    this.displayDialog = false;
    this.value = {
      id: '',
      year: '',
      value: ''
    };
    this.onTouched();
    this.onChange(this.listValues);
  }

  createId(): string {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.listValues.length; i++) {
      if (this.listValues[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }
  hideDialog() {
    this.displayDialog = false;
  }

  hideDialogModal() {
    this.displayModal = false;
  }
}
