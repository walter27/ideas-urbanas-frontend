import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  // tslint:disable-next-line:variable-name
  private _showLoading = false;

  constructor() { }

  get showLoading(): boolean {
    return this._showLoading;
  }

  set showLoading(value: boolean) {
    setTimeout( (val) => {
      this._showLoading = value;
    }, 0);
  }
}
