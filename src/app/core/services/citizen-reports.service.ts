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
import { Clasification } from '../models/clasification.model';
import { CitizenReports } from '../models/citizen-reports.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class CitizenReportsService {

  serverUrl = environment.serverUrl;
  urlReports = environment.reports.base;

  constructor( 
    private httpClient: HttpClient,
    private utilsService: UtilsService
  ) {

  } 

  listReports(filters: Filters): Observable<ResultList<CitizenReports>> {
    const filtersB = this.utilsService.buildFilters(filters);
    return this.httpClient.get<ResponseApi<ResultList<CitizenReports>>>(this.serverUrl + this.urlReports + filtersB).pipe(
      map(data => {
        data.results.data.forEach(el => {
          el.image_route = this.serverUrl + el.image_route.substr(2);
        });
        return data.results;
      })
    );
  }

  addReports(profile) {

    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('url', profile.url);
    formData.append('description', profile.description);
    formData.append('image', profile.images.image, profile.images.image.name);
    return this.httpClient.post(this.serverUrl + this.urlReports, formData);
  }

  editReports(profile, id) {


    console.log(profile);
    

    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('description', profile.description);
    formData.append('url', profile.url);
    if (profile.images.image && profile.images.image.name) {
      formData.append('image', profile.images.image, profile.images.image.name);
    }


    return this.httpClient.put(this.serverUrl + this.urlReports + '/' + id, formData);
  }

  deleteReports(id) {
    return this.httpClient.delete(this.serverUrl + this.urlReports + '/' + id, httpOptions);
  }
}
