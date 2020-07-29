import { Component, OnInit } from '@angular/core';
import { RegionService } from 'src/app/core/services/region.service';
import { Region } from 'src/app/core/models/regions.model';
import { Filters } from 'src/app/core/models/filters.model';

@Component({
  selector: 'app-intermediate-cities',
  templateUrl: './intermediate-cities.component.html',
  styleUrls: ['./intermediate-cities.component.scss']
})
export class IntermediateCitiesComponent implements OnInit {

  cantons: any = [];
  filters: Filters = {
    page: 0,
    limit: 30,
    ascending: true,
    sort: '_id'
  };
  constructor(private regionService: RegionService) { }

  ngOnInit() {

    this.regionService.listRegionsPublic(this.filters, 'Canton').subscribe(resp => {

      resp.data.forEach(canton => {

        this.cantons.push({
          name: canton.name,
          img: `assets/cities/all/${canton.name.toLowerCase()}.jpg`,
          url: `/cities?city=${canton._id}`

        })
      });

    });

  }

}
