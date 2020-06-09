import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseApi } from '../models/responseApi.model';
import { ResultList } from '../models/resultList.model';
import { Config } from '../models/config.model';
import { Filters } from '../models/filters.model';
import { UtilsService } from './utils.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  serverUrl = environment.serverUrl;
  urlCategory = environment.category.base;

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService
    ) {

  }

  listCategory(): Observable<any> {
    return this.httpClient.get<any>(this.serverUrl + this.urlCategory).pipe(
      map(data => {
        return data;
      })
    );
  }
}
