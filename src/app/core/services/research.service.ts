import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseApi } from '../models/responseApi.model';
import { ResultList } from '../models/resultList.model';
import { Filters } from '../models/filters.model';
import { UtilsService } from './utils.service';
import { Research } from '../models/research.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const httpOptionsFile = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ResearchService {

  serverUrl = environment.serverUrl;
  urlResearch = environment.research.base;
  urlGetResearchsByCatAndCant = environment.home.getResearchsByCatAndCant;

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService
  ) {

  }

  listResearchs(filters: Filters): Observable<ResultList<Research>> {
    const filtersB = this.utilsService.buildFilters(filters);
    return this.httpClient.get<ResponseApi<ResultList<Research>>>(this.serverUrl + this.urlResearch + filtersB).pipe(
      map(data => {
        /* data.results.data.forEach(el => {
           el.image_route = this.serverUrl + el.image_route.substr(2);
         });*/
        return data.results;
      })
    );
  }

  addResearch(profile) {
    const formData = new FormData();
    formData.append('title', profile.title);
    formData.append('author', profile.author);
    formData.append('year', profile.year);
    formData.append('link', profile.link);
    formData.append('id_Canton', profile.id_Canton);
    formData.append('category', profile.category);
    //formData.append('image', profile.images.image, profile.images.image.name);
    return this.httpClient.post(this.serverUrl + this.urlResearch, formData);
  }

  editResearch(profile, id) {

    const formData = new FormData();
    formData.append('title', profile.title);
    formData.append('author', profile.author);
    formData.append('year', profile.year);
    formData.append('link', profile.link);
    formData.append('id_Canton', profile.id_Canton);
    formData.append('category', profile.category);
    /*if (profile.images.image && profile.images.image.name) {
      formData.append('image', profile.images.image, profile.images.image.name);
    }*/
    return this.httpClient.put(this.serverUrl + this.urlResearch + '/' + id, formData);
  }

  deleteResearch(id) {
    return this.httpClient.delete(this.serverUrl + this.urlResearch + '/' + id, httpOptions);
  }

  // tslint:disable-next-line:variable-name
  getResearchsByCatAndCant(id_Canton, category?): Observable<ResultList<Research>> {
    return this.httpClient.post<ResponseApi<ResultList<Research>>>(
      this.serverUrl + this.urlGetResearchsByCatAndCant, { id_Canton, category }, httpOptions).pipe(
        map(data => {
         /* data.results.data.forEach(el => {
            el.image_route = this.serverUrl + el.image_route.substr(2);
          });*/
          return data.results;
        })
      );
  }
}
