import { Injectable } from '@angular/core';
import { filter } from 'minimatch';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  itemSelected: any;
  buttonVisible = false;

  constructor() {

  }

  buildFilters(filters) {
    let solve = '';
    Object.keys(filters).forEach((k, idx) => {
      const key = k;
      const value = filters[k];
      if (idx === 0) {
        solve += '?';
      } else {
        solve += '&';
      }
      solve += key + '=' + value;
    });
    return solve;
  }

  getStringFromDateNow() {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
  }

  format(input) {
    input = input.toString();
    let num = input.replace(/\./g, '');
    if (!isNaN(num)) {
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/, '');
      input = num;
    } else {
      input = input.value.replace(/[^\d\.]*/g, '');
    }
    return parseFloat(input);
  }
}
