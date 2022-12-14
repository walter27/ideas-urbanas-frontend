import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseApi } from '../models/responseApi.model';
import { ResultList } from '../models/resultList.model';
import { Filters } from '../models/filters.model';
import { UtilsService } from './utils.service';
import { Data } from '@angular/router';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class DataService {

  serverUrl = environment.serverUrl;
  urlData = environment.data.base;
  urlDataIndexes = environment.data.indexes;

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService
  ) {

  }

  listDataIndexes(years?): Observable<ResponseApi<any>> {

    const body = {
      years
    };

    return this.httpClient.post<ResponseApi<any>>(this.serverUrl + 'api/' + this.urlDataIndexes, body).pipe(
      map(data => {
        return data.results.data;
      })
    );
  }

  listYears() {
    return this.httpClient.get(`${this.serverUrl}api/years`, httpOptions).pipe(map(data => {
      return data['results'].data.years;
    }));

  }

  // tslint:disable-next-line:variable-name
  listDatasPublic(filters: Filters, id_Variable?, cities?, years?): Observable<ResultList<Data>> {

    const filtersB = this.utilsService.buildFilters(filters);
    const body = {
      id_Variable,
      cities,
      years
    };

   /* if (cities) {
      body.cities = cities.filter((c) => {
        if (c.check) {
          return true;
        }
        return false;
      }).map(c => c.id);
    }*/
    return this.httpClient.post<ResponseApi<ResultList<Data>>>(this.serverUrl + 'api/' + this.urlData + filtersB, body).pipe(
      map(data => {
        /* data.results.data.forEach(element => {
          element.value = this.utilsService.format(element.value);
        }); */
        return data.results;
      })
    );
  }

  // tslint:disable-next-line:variable-name
  listDatas(filters: Filters, id_Variable?, cities?, search?): Observable<ResultList<Data>> {
    const filtersB = this.utilsService.buildFilters(filters);
    const body = {
      id_Variable,
      cities: null,
      search
    };

    if (cities) {
      body.cities = cities.filter((c) => {
        if (c.check) {
          return true;
        }
        return false;
      }).map(c => c.id);
    }
    return this.httpClient.post<ResponseApi<ResultList<Data>>>(this.serverUrl + this.urlData + '/filter/' + filtersB, body).pipe(
      map(data => {
        return data.results;
      })
    );
  }


  listDatasCovid(filters: Filters, idVariable?, cities?): Observable<ResultList<Data>> {

    const filtersB = this.utilsService.buildFilters(filters);
    const body = {
      idVariable,
      cities
    };

    return this.httpClient.post<ResponseApi<ResultList<Data>>>(this.serverUrl + 'api/covid/' + filtersB, body).pipe(
      map(data => {
        return data.results;
      })
    );
  }

  getData() {
    return this.httpClient.get(`${this.serverUrl}getCSV/datos/researchs`, httpOptions);
  }

  addData(profile) {
    return this.httpClient.post(this.serverUrl + this.urlData, profile, httpOptions);
  }

  editData(profile, id) {
    return this.httpClient.put(this.serverUrl + this.urlData + '/' + id, profile, httpOptions);
  }

  deleteData(id) {
    return this.httpClient.delete(this.serverUrl + this.urlData + '/' + id, httpOptions);
  }

  // tslint:disable-next-line:variable-name
  downloadCSV(filters: Filters, id_Variable?, cities?, years?) {
    const filtersB = this.utilsService.buildFilters(filters);
    const body = {
      id_Variable,
      cities: null,
      years: null
    };

    if (cities) {
      body.cities = cities.filter((c) => {
        if (c.check) {
          return true;
        }
        return false;
      }).map(c => c.id);
    }

    if (years) {
      body.years = years.filter(c => {
        if (c.check) {
          return true;
        }
        return false;
      }).map(c => c.id);
    }

    const headers = new HttpHeaders();
    return this.httpClient.post(this.serverUrl + 'exportdata/' + filtersB, body, { responseType: 'arraybuffer' }).pipe(
      map(data => {
        return data;
      })
    );
  }
}
