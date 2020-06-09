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


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class OriginService {

  serverUrl = environment.serverUrl;
  urlOrigin = environment.origin.base;

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService
    ) {

  }

  listOrigins(filters: Filters): Observable<ResultList<Origin>> {
    const filtersB = this.utilsService.buildFilters(filters);
    return this.httpClient.get<ResponseApi<ResultList<Origin>>>(this.serverUrl + this.urlOrigin + filtersB).pipe(
      map(data => {
        return data.results;
      })
    );
  }

  addOrigin(profile) {
    return this.httpClient.post(this.serverUrl + this.urlOrigin, profile, httpOptions);
  }

  editOrigin(profile, id) {
    return this.httpClient.put(this.serverUrl + this.urlOrigin + '/' + id, profile, httpOptions);
  }

  deleteOrigin(id) {
    return this.httpClient.delete(this.serverUrl + this.urlOrigin + '/' + id, httpOptions);
  }
}
