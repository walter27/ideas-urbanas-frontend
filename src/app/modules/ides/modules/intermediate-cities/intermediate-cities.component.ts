import { Component, OnInit, DoCheck } from '@angular/core';
import { RegionService } from 'src/app/core/services/region.service';
import { Filters } from 'src/app/core/models/filters.model';

let { titleCase }: any = require('../../../../core/utils/utils');
const accents = require('remove-accents');



@Component({
  selector: 'app-intermediate-cities',
  templateUrl: './intermediate-cities.component.html',
  styleUrls: ['./intermediate-cities.component.scss']
})
export class IntermediateCitiesComponent implements OnInit, DoCheck {

  cantons: any;
  cities: any = [];
  citiesPublic: any[];
  filters: Filters = {
    page: 0,
    limit: 30,
    ascending: true,
    sort: '_id'
  };
  step: number = 1;
  citySelected: any;


  constructor(private regionService: RegionService) { }

  ngOnInit() {

    this.getCantons();



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





  }

  getCantons() {

    this.cantons = [];

    this.regionService.listRegionsPublic(this.filters, 'Canton').subscribe(resp => {
      resp.data.forEach(canton => {

        this.cantons.push({
          name: titleCase(canton.name),
          img: `${accents.remove('assets/cities/all/' + canton.name.toLowerCase())}.jpg`,
          url: '/cities',
          id: canton._id,
          queryParams: {
            city: canton._id
          }

        });

        if (!this.citySelected) {
          this.citySelected = this.cantons[0];
          this.regionService.citySelectedWordCloud = this.citySelected;
        }

      });
    })

  }

  ngDoCheck() {

    if (this.regionService.showWordCloud === 2) {

      this.step = this.regionService.showWordCloud;
    }

    if (this.regionService.showWordCloud === 1) {


      this.step = this.regionService.showWordCloud;
    }



  }






  getCitySelected() {

  }

}
