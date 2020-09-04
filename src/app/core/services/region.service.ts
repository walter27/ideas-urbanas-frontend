import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseApi } from '../models/responseApi.model';
import { ResultList } from '../models/resultList.model';
import { Filters } from '../models/filters.model';
import { Region } from '../models/regions.model';
import { UtilsService } from './utils.service';

enum url {
  Province = 'provincia',
  Canton = 'canton',
  Parish = 'parroquia'
}




const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class RegionService {

  serverUrl = environment.serverUrl;
  urlProvince = environment.province.base;
  urlCanton = environment.canton.base;
  urlParish = environment.parish.base;
  citySelect: any;
  citySelectedCloud: any;
  citiesMap: any;
  showWordCloud: number;
  citySelectedWordCloud: any;


  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService
  ) {

  }

  listRegionsPublic(filters: Filters, model: string, body: any = {}): Observable<ResultList<Region>> {
    const filtersB = this.utilsService.buildFilters(filters);
    return this.httpClient.get<ResponseApi<ResultList<Region>>>(this.serverUrl + 'api/' + url[model] + filtersB).pipe(
      map(data => {
        return data.results;
      })
    );
  }

  listRegions(filters: Filters, model: string, body: any = {}): Observable<ResultList<Region>> {
    const filtersB = this.utilsService.buildFilters(filters);
    return this.httpClient.post<ResponseApi<ResultList<Region>>>(this.serverUrl + url[model] + '/filter/' + filtersB, body).pipe(
      map(data => {
        return data.results;
      })
    );
  }

  addRegion(profile, model: string) {

    if (profile.is_intermediate === null && model === 'Canton') {

      profile.is_intermediate = false;


    }
    if (profile.indexes === null && model === 'Canton') {
      profile.indexes = false;

    }
    if (profile.covid === null && model === 'Canton') {
      profile.covid = false;

    }

    if (profile.active === null && model === 'Province') {
      profile.active = false;

    }

    return this.httpClient.post(this.serverUrl + url[model], profile, httpOptions);
  }

  editRegion(profile, id: string, model: string) {
    return this.httpClient.put(this.serverUrl + url[model] + '/' + id, profile, httpOptions);
  }

  deleteRegion(id, model: string) {
    return this.httpClient.delete(this.serverUrl + url[model] + '/' + id, httpOptions);
  }

  getRegion(id: string, model: string) {
    return this.httpClient.get<any>(this.serverUrl + 'api/' + url[model] + '/' + id).pipe(
      map(data => {
        return data.results.data;
      })
    );
  }
}
