import { Component, OnInit } from '@angular/core';
import { CitizenReports } from 'src/app/core/models/citizen-reports.model';
import { CitizenReportsService } from 'src/app/core/services/citizen-reports.service';
import { ResultList } from 'src/app/core/models/resultList.model';
import { Observable } from 'rxjs';
import { Filters } from 'src/app/core/models/filters.model';

@Component({
  selector: 'app-citizen-reports',
  templateUrl: './citizen-reports.component.html',
  styleUrls: ['./citizen-reports.component.scss']
})
export class CitizenReportsComponent implements OnInit {

  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: '_id'
  };

  resultReports$: Observable<ResultList<CitizenReports>>;

  constructor(
    private reportsService: CitizenReportsService
  ) { }

  ngOnInit() {
   /* let elem: HTMLElement = document.getElementById('navbarMenu');
    elem.style.setProperty("background-color", '#189cff');
    elem.classList.add("sticky-top");
    elem.classList.remove("fixed-top");*/

    this.getClasifications();
  }

  getClasifications() {
    this.resultReports$ = this.reportsService.listReports(this.filters);
  }

}
