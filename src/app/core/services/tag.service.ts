import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseApi } from '../models/responseApi.model';
import { ResultList } from '../models/resultList.model';
import { Filters } from '../models/filters.model';
import { Tag } from '../models/tags.model';
import { Word } from '../models/wordTag.model';

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
  urlWord = environment.word.base;
  urlTagsByCantByType = environment.home.getTagsByCantByType;
  urlAddTag = environment.home.addTag;
  urlStopwords = environment.home.getStopwords;

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService
  ) {

  }

  listWords(filters: Filters, body: any = {}): Observable<ResultList<Word>> {
    const filtersB = this.utilsService.buildFilters(filters);
    return this.httpClient.post<ResponseApi<ResultList<Word>>>(this.serverUrl + this.urlWord + '/filter' + filtersB, body).pipe(
      map(data => {
        return data.results;
      })
    );
  }

  addTag(tag) {
    return this.httpClient.post(this.serverUrl + this.urlAddTag, tag, httpOptions);
  }

  addWord(profile) {
    return this.httpClient.post(this.serverUrl + this.urlWord, profile, httpOptions);

  }

  editWord(profile, id: string) {

    return this.httpClient.put(this.serverUrl + this.urlWord + '/' + id, profile, httpOptions);
  }

  deleteWord(id) {
    return this.httpClient.delete(this.serverUrl + this.urlWord + '/' + id, httpOptions);
  }

  getWord(body: any = {}): Observable<ResultList<Word>> {
    return this.httpClient.post<ResponseApi<ResultList<Word>>>(this.serverUrl + this.urlWord + '/text', body).pipe(map(data => {
      return data.results;
    }));
  }

  getTagsByCantByType(id_Canton: string, type = 'all'): Observable<ResultList<Tag>> {
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
  updateStopwords(listStopWords: any, id: string) {

    return this.httpClient.put(this.serverUrl + this.urlTag + '/stopwords/' + id, listStopWords, httpOptions);
  }

}
