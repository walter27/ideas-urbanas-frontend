import { Component, OnInit, DoCheck } from '@angular/core';
import { RegionService } from 'src/app/core/services/region.service';
import { Filters } from 'src/app/core/models/filters.model';

@Component({
  selector: 'app-intermediate-cities',
  templateUrl: './intermediate-cities.component.html',
  styleUrls: ['./intermediate-cities.component.scss']
})
export class IntermediateCitiesComponent implements OnInit, DoCheck {

  cantons: any = [];
  cities: any = [];
  citiesPublic: any[];
  filters: Filters = {
    page: 0,
    limit: 30,
    ascending: true,
    sort: '_id'
  };
  step: number;
  citySelected: any;

  constructor(private regionService: RegionService) { }

  ngOnInit() {

    this.cities = this.regionService.citiesMap;
    if (!this.citySelected) {
      this.citySelected = this.cities[0];
      this.regionService.citySelectedWordCloud = this.citySelected;
    }


    /*this.cities.forEach(canton => {

      this.cantons.push({
        name: canton.title,
        img: `assets/cities/all/${canton.title.toLowerCase()}.jpg`,
        url: '/cities',
        queryParams: {
          city: canton.id
        }

      });
    });*/


    this.regionService.listRegionsPublic(this.filters, 'Canton').subscribe(resp => {
      resp.data.forEach(canton => {

        this.cantons.push({
          name: canton.name,
          img: `assets/cities/all/${canton.name.toLowerCase()}.jpg`,
          url: '/cities',
          queryParams: {
            city: canton._id
          }

        });
      });
    })
    this.step = 1;

  }

  ngDoCheck() {

    if (this.regionService.showWordCloud !== 1) {
      this.step = this.regionService.showWordCloud;
    } else {
      this.step = 1;
    }



  }






  getCitySelected() {
    console.log(this.citySelected);

  }

}
