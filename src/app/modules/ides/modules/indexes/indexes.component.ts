import { Component, OnInit } from '@angular/core';
import { ClasificationService } from 'src/app/core/services/clasification.service';
import { Filters } from 'src/app/core/models/filters.model';
import { RegionService } from 'src/app/core/services/region.service';
import { ItemDropdown } from 'src/app/core/models/item-dropdown.model';
import { Options } from 'ng5-slider';
import { DataService } from 'src/app/core/services/data.service';
const accents = require('remove-accents');



@Component({
  selector: 'app-indexes',
  templateUrl: './indexes.component.html',
  styleUrls: ['./indexes.component.scss']
})
export class IndexesComponent implements OnInit {

  filters: Filters = {
    page: 0,
    limit: 100,
    ascending: true,
    sort: 'name'
  };
  resultClasification: any;
  v: any;
  cities: ItemDropdown[] = [];
  options: Options = {
    floor: 0,
    ceil: 0
  };
  minValue: number;
  maxValue: number;
  years: any;
  citiesSelected: any[] = [];
  yearsSelected: any[] = [];

  constructor(private clasificationService: ClasificationService,
    private regionService: RegionService,
    private dataService: DataService) {

  }

  ngOnInit() {
    /*let elem: HTMLElement = document.getElementById('navbarMenu');
    elem.style.setProperty("background-color", '#189cff');
    elem.classList.add("sticky-top");
    elem.classList.remove("fixed-top");*/

    /*this.dataService.listYears().subscribe(resp => {
      this.options = {
        floor: resp.data.years[0],
        ceil: resp.data.years[resp.data.years.length - 1]

      };
      this.minValue = resp.data.years[0];
      this.maxValue = resp.data.years[10];
    });*/

    this.getYears();
    this.getClasifications();
    this.getCities();
  }


  getYears() {

    this.years = this.dataService.listYears();
    this.years.forEach(years => {
      this.options = {
        floor: years[0],
        ceil: years[years.length - 1]
      };
      this.minValue = years[0];
      this.maxValue = years[10];
      for (let i = this.minValue; i <= this.maxValue; i++) {
        this.yearsSelected.push(i);
      }
    });



  }

  getClasifications() {

    let newRes;
    let finalRes: any = [];
    this.clasificationService.listClasification(this.filters).subscribe(resp => {


      newRes = resp.data.filter(clasification => clasification.name !== 'Corona Virus');

      for (const thematic of newRes) {
        thematic.image_active_route = `${accents.remove('assets/ICONOS/' + thematic.name)}-AZUL.png`;
        thematic.image_route = `${accents.remove('assets/ICONOS/' + thematic.name)}-AZUL.png`;
        finalRes.push(thematic);
      }

      this.resultClasification = finalRes;
    });
  }

  getCities() {
    this.regionService.listRegionsPublic({ page: 0, limit: 1000, ascending: true, sort: '_id' }, 'Canton').subscribe(
      resp => {
        this.cities = [];
        resp.data.forEach(c => {
          if (c.indexes) {
            this.cities.push(
              { id: c._id, name: c.name, check: true, color: c.color }
            );
          }
        });

        this.citiesSelected.push(this.cities[0]);
        this.getClasifications();
      }
    );
  }

  getRangeYears(e) {

    this.yearsSelected = [];

    for (let i = e.value; i <= e.highValue; i++) {
      this.yearsSelected.push(i);
    }
  }

}
