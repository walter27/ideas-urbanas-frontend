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



  years: any[] = [];
  yearSelected: any;
  indexes: any[] = [];
  indexesSelected: any[] = [];




  constructor(
    private clasificationService: ClasificationService,
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
    this.getIndexes();
    //this.getClasifications();
    //this.getCities();
  }


  getYears() {

    this.dataService.listYears().subscribe((years) => {


      years.forEach(year => {
        this.years.push({ year });

      });

    });




  }



  getIndexes() {
    this.dataService.listDataIndexes().subscribe((resp: any) => {

      this.indexes = resp;

  
      if (this.indexesSelected.length === 0) {

        this.indexesSelected.push(this.indexes[0]);



      }
    })



  }







}
