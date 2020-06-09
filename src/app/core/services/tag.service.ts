import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseApi } from '../models/responseApi.model';
import { ResultList } from '../models/resultList.model';
import { Filters } from '../models/filters.model';
import { Tag } from '../models/tags.model';
import { Stopword } from '../models/stopwords.model';
import { UtilsService } from './utils.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class TagService {

  serverUrl = environment.serverUrl;
  urlTag = environment.tag.base;
  urlTagsByCantByType = environment.home.getTagsByCantByType;
  urlAddTag = environment.home.addTag;
  urlStopwords = environment.home.getStopwords; 

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService
  ) {

  }

  listTags(filters: Filters, body: any = {}): Observable<ResultList<Tag>> {
    const filtersB = this.utilsService.buildFilters(filters);
    return this.httpClient.post<ResponseApi<ResultList<Tag>>>(this.serverUrl +  this.urlTag + '/filter' +filtersB, body).pipe(
      map(data => {
        return data.results;
      })
    );
  }

  addTag(tag) {
    return this.httpClient.post(this.serverUrl + this.urlAddTag, tag, httpOptions);
  }

  editTag(tag, id: string, model: string) {
    return this.httpClient.put(this.serverUrl + this.urlTag + '/' + id, tag, httpOptions);
  }

  deleteTag(id) {
    return this.httpClient.delete(this.serverUrl + this.urlTag + '/' + id, httpOptions);
  }

  getTag(id: string, model: string) {
    return this.httpClient.get<any>(this.serverUrl + this.urlTag + '/' + id).pipe(
      map(data => {
        return data.results.data;
      })
    );
  }

  getTagsByCantByType(id_Canton, type = 'all'): Observable<ResultList<Tag>> {
    return this.httpClient.post<ResponseApi<ResultList<Tag>>>(
      this.serverUrl + this.urlTagsByCantByType, { id_Canton, type }, httpOptions).pipe(
        map(data => {
          return data.results;
        })
      );
  }

  getStopwords(): Observable<ResultList<Stopword>> {
    return this.httpClient.post<ResponseApi<ResultList<Stopword>>>(
      this.serverUrl + this.urlStopwords, httpOptions).pipe(
        map(data => {
          return data.results;
        })
      );
  }

}
