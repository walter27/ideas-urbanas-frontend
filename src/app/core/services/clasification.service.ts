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


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class ClasificationService {

  serverUrl = environment.serverUrl;
  urlClasification = environment.clasification.base;

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService
    ) {

  }

  listClasification(filters: Filters): Observable<ResultList<Clasification>> {
    const filtersB = this.utilsService.buildFilters(filters);
    return this.httpClient.get<ResponseApi<ResultList<Clasification>>>(this.serverUrl + 'api/' + this.urlClasification + filtersB).pipe(
      map( data => {
        data.results.data.forEach( el => {
          el.image_route = this.serverUrl + el.image_route.substr(2);
          el.image_active_route = this.serverUrl + el.image_active_route.substr(2);
        });
        return data.results;
      })
    );
  }

  addClasification(profile) {
    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('description', profile.description);
    formData.append('image', profile.images.image, profile.images.image.name);
    formData.append('image_active', profile.images.image_active, profile.images.image_active.name);
    return this.httpClient.post(this.serverUrl + this.urlClasification, formData);
  }

  editClasification(profile, id) {
    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('description', profile.description);
    if ( profile.images.image && profile.images.image.name ) {
      formData.append('image', profile.images.image, profile.images.image.name);
    }
    if ( profile.images.image_active && profile.images.image_active.name ) {
      formData.append('image_active', profile.images.image_active, profile.images.image_active.name);
    }
    return this.httpClient.put(this.serverUrl + this.urlClasification + '/' + id, formData);
  }

  deleteClasification(id) {
    return this.httpClient.delete(this.serverUrl + this.urlClasification + '/' + id, httpOptions);
  }
}
