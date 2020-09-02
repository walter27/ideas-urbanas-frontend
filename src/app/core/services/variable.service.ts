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
import { Variable } from '../models/variable.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class VariableService {

  serverUrl = environment.serverUrl;
  urlVariable = environment.variable.base;
  urlGetVariablesByClasification = environment.home.getVariablesByClasification;

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService
  ) {

  }

  listVariables(filters: Filters): Observable<ResultList<Variable>> {

    const filtersB = this.utilsService.buildFilters(filters);

    return this.httpClient.get<ResponseApi<ResultList<Variable>>>(this.serverUrl + this.urlVariable + filtersB).pipe(
      map(data => {

        return data.results;
      })
    );
  }

  addVariable(profile) {
    return this.httpClient.post(this.serverUrl + this.urlVariable, profile, httpOptions);
  }

  editVariable(profile, id) {
    return this.httpClient.put(this.serverUrl + this.urlVariable + '/' + id, profile, httpOptions);
  }

  deleteVariable(id) {
    return this.httpClient.delete(this.serverUrl + this.urlVariable + '/' + id, httpOptions);
  }

  // tslint:disable-next-line:variable-name
  getVariablesByClasification(id_Clasification: string): Observable<ResultList<Variable>> {
    return this.httpClient.post<ResponseApi<ResultList<Variable>>>(
      this.serverUrl + this.urlGetVariablesByClasification, { id_Clasification }, httpOptions).pipe(
        map(data => {
          return data.results;
        })
      );

  }
}
