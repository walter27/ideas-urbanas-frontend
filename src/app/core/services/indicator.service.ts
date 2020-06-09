import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseApi } from '../models/responseApi.model';
import { ResultList } from '../models/resultList.model';
import { Origin } from '../models/origin.model';
import { Filters } from '../models/filters.model';
import { UtilsService } from './utils.service';
import { Indicator } from '../models/indicator.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class IndicatorService {

  serverUrl = environment.serverUrl;
  urlIndicator = environment.indicator.base;

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService
    ) {

  }

  listIndicators(filters: Filters): Observable<ResultList<Indicator>> {
    const filtersB = this.utilsService.buildFilters(filters);
    return this.httpClient.get<ResponseApi<ResultList<Indicator>>>(this.serverUrl + this.urlIndicator + filtersB).pipe(
      map(data => {
        return data.results;
      })
    );
  }

  addIndicator(profile) {
    return this.httpClient.post(this.serverUrl + this.urlIndicator, profile, httpOptions);
  }

  editIndicator(profile, id) {
    return this.httpClient.put(this.serverUrl + this.urlIndicator + '/' + id, profile, httpOptions);
  }

  deleteIndicator(id) {
    return this.httpClient.delete(this.serverUrl + this.urlIndicator + '/' + id, httpOptions);
  }
}
