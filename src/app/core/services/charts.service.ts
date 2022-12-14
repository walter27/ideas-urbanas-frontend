import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ResponseApi } from "../models/responseApi.model";
import { ResultList } from "../models/resultList.model";
import { Config } from "../models/config.model";
import { Filters } from "../models/filters.model";
import { UtilsService } from "./utils.service";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
@Injectable({
  providedIn: "root",
})
export class ChartsService {
  serverUrl = environment.serverUrl;
  urlCharts = environment.charts.base;
  urlYearsAvailableForVariable = environment.charts.yearsAvailableForVariable;
  imageBase24: any;
  imageRadarBase24: any;


  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService
  ) { }

  listCharts(): Observable<any> {
    return this.httpClient.get<any>(this.serverUrl + this.urlCharts).pipe(
      map((data) => {
        return data;
      })
    );
  }

  listYears(idVariable): Observable<any> {
    return this.httpClient
      .get<any>(
        this.serverUrl + this.urlYearsAvailableForVariable + "/" + idVariable
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  generateImage(options: any, variable: any) {

    let body = {
      options,
      variable
    }


    return this.httpClient
      .post(this.serverUrl + this.urlCharts + "/image", body, httpOptions)
      .pipe(
        map((resp: any) => {
          let urlImage = this.serverUrl + this.urlCharts + `/share/${resp.name}`;
          return urlImage;
        })
      );
  }



}
