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
export class ConfigService {

  serverUrl = environment.serverUrl;
  urlConfig = environment.config.base;
  stage = environment.stage;

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService
    ) {

  }

  listConfigs(filters: Filters): Observable<ResultList<Config>> {
    const filtersB = this.utilsService.buildFilters(filters);
    return this.httpClient.get<ResponseApi<ResultList<Config>>>(this.serverUrl + this.urlConfig + filtersB).pipe(
      map(data => {
        return data.results;
      })
    );
  }

  addConfig(profile) {
    return this.httpClient.post(this.serverUrl + this.urlConfig, profile, httpOptions);
  }

  editConfig(profile, id) {
    return this.httpClient.put(this.serverUrl + this.urlConfig + '/' + id, profile, httpOptions);
  }

  deleteConfig(id) {
    return this.httpClient.delete(this.serverUrl + this.urlConfig + '/' + id, httpOptions);
  }
}
