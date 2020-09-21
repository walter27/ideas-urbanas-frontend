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
        data.results.data.forEach(el => {
          el.image_route = this.serverUrl + el.image_route.substr(2);
        });
        return data.results;
      })
    );
  }

  addVariable(profile) {


    if (profile.is_indice === null) {
      profile.is_indice = false;

    }
    if (profile.active === null) {
      profile.is_indice = false;

    }

    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('type', profile.type);
    formData.append('description', profile.description);
    formData.append('chart_type', profile.chart_type);
    formData.append('id_Clasification', profile.id_Clasification);
    formData.append('origins', profile.origins);
    formData.append('active', profile.active);
    formData.append('is_indice', profile.is_indice);
    formData.append('values_indice', profile.values_indice);
    formData.append('image', profile.images.image, profile.images.image.name);





    return this.httpClient.post(this.serverUrl + this.urlVariable, formData);
  }

  editVariable(profile, id) {

    console.log(profile.values_indice);


    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('type', profile.type);
    formData.append('description', profile.description);
    formData.append('chart_type', profile.chart_type);
    formData.append('id_Clasification', profile.id_Clasification);
    formData.append('origins', profile.origins);
    formData.append('active', profile.active);
    formData.append('is_indice', profile.is_indice);
    formData.append('values_indice', JSON.stringify(profile.values_indice));

    if (profile.images.image && profile.images.image.name) {
      formData.append('image', profile.images.image, profile.images.image.name);
    }

    console.log(formData);


    return this.httpClient.put(this.serverUrl + this.urlVariable + '/' + id, formData);
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
