import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-ides-configs-indicator',
  templateUrl: './ides-configs-indicator.component.html',
  styleUrls: ['./ides-configs-indicator.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdesConfigsIndicatorComponent),
      multi: true
    }
  ]
})
export class IdesConfigsIndicatorComponent implements OnInit {

  value = [
    [0, 0],
    [0, 0],
    [0]
  ];
  onChange = (_: any) => { };
  onTouch = () => { };

  constructor() { }

  ngOnInit() {
  }

  onInput(event, x, y) {
    this.value[x][y] = +event.target.value;
    this.onTouch();
    this.onChange(this.value);
  }

  writeValue(value: any): void {
    if (value) {
      this.value[0][0] = +value[0][0];
      this.value[0][1] = +value[0][1];
      this.value[1][0] = +value[1][0];
      this.value[1][1] = +value[1][1];
      this.value[2][0] = +value[2][0];
    } else {
      this.value[0][0] = 0;
      this.value[0][1] = 0;
      this.value[1][0] = 0;
      this.value[1][1] = 0;
      this.value[2][0] = 0;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

}

