import { Component, OnInit, Input } from '@angular/core';
import { CitizenReports } from 'src/app/core/models/citizen-reports.model';

@Component({
  selector: 'app-ides-citizen-reports-card',
  templateUrl: './ides-citizen-reports-card.component.html',
  styleUrls: ['./ides-citizen-reports-card.component.scss']
})
export class IdesCitizenReportsCardComponent implements OnInit {

  @Input() item: CitizenReports;
  hidden = true;
  title = '';
  content = '';

  constructor() { }

  ngOnInit() {
  }

  getValue(item) {
    this.title = item.name;
    this.content = item.description;
  }

}
