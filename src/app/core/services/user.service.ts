import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import { ResponseApi } from '../models/responseApi.model';
import { ResultList } from '../models/resultList.model';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';
import { element } from 'protractor';
import { Filters } from '../models/filters.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {

  serverUrl = environment.serverUrl;
  urlUser = environment.users.base;
  stage = environment.stage;

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService
    ) {
  }

  listUsers(filters: Filters): Observable<ResultList<User>> {
    const filtersB = this.utilsService.buildFilters(filters);
    return this.httpClient.get<ResponseApi<ResultList<User>>>(this.serverUrl + this.urlUser + filtersB).pipe(
      map(data => {
        return data.results;
      })
    );
  }

  addUser(profile) {
    return this.httpClient.post(this.serverUrl + this.urlUser, profile, httpOptions);
  }

  editUser(profile: User, id) {
    return this.httpClient.put(this.serverUrl + this.urlUser + '/' + id, profile, httpOptions);
  }

  deleteUser(id) {
    return this.httpClient.delete(this.serverUrl + this.urlUser + '/' + id, httpOptions);
  }
}
