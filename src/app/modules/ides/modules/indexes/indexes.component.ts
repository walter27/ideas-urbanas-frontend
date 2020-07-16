import { Component, OnInit } from '@angular/core';
import { ClasificationService } from 'src/app/core/services/clasification.service';
import { Filters } from 'src/app/core/models/filters.model';
import { RegionService } from 'src/app/core/services/region.service';
import { ItemDropdown } from 'src/app/core/models/item-dropdown.model';

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

  constructor(private clasificationService: ClasificationService, private regionService: RegionService) {

  }

  ngOnInit() {
    /*let elem: HTMLElement = document.getElementById('navbarMenu');
    elem.style.setProperty("background-color", '#189cff');
    elem.classList.add("sticky-top");
    elem.classList.remove("fixed-top");*/

    this.getClasifications();
    this.getCities();
  }

  getClasifications() {

    let newRes;
    let finalRes: any = [];
    this.clasificationService.listClasification(this.filters).subscribe(resp => {


      newRes = resp.data.filter(clasification => clasification.name !== 'Corona Virus');

      for (const thematic of newRes) {
        thematic.image_active_route = `assets/ICONOS/${thematic.name}.png`;
        thematic.image_route = `assets/ICONOS/${thematic.name}-AZUL.png`;
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
          if (c.active) {
            this.cities.push(
              { id: c._id, name: c.name, check: true, color: c.color }
            );
          }
        });
        this.getClasifications();
      }
    );
  }

}
