import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultList } from 'src/app/core/models/resultList.model';
import { Clasification } from 'src/app/core/models/clasification.model';
import { ClasificationService } from 'src/app/core/services/clasification.service';
import { Filters } from 'src/app/core/models/filters.model';

@Component({
  selector: 'app-thematic',
  templateUrl: './thematic.component.html',
  styleUrls: ['./thematic.component.scss']
})
export class ThematicComponent implements OnInit {

  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: 'name'
  };

  resultClasification$: Observable<ResultList<Clasification>>;

  constructor(
    private clasificationService: ClasificationService
  ) { }

  ngOnInit() {
    /*let elem: HTMLElement = document.getElementById('navbarMenu');
    elem.style.setProperty("background-color", '#189cff');
    elem.classList.add("sticky-top");
    elem.classList.remove("fixed-top");

    this.getClasifications();
    //console.log(window.location.href);*/
  }

  getClasifications() {
    this.resultClasification$ = this.clasificationService.listClasification(this.filters);
  }

}
