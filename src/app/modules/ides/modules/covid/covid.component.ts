import { Component, OnInit } from '@angular/core';
import { ClasificationService } from '../../../../core/services/clasification.service';
import { VariableService } from '../../../../core/services/variable.service';
import { DataService } from '../../../../core/services/data.service';



@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.scss']
})
export class CovidComponent implements OnInit {

  clasification: any = [];
  filters = {
    page: 0,
    limit: 100,
    ascending: true,
    sort: 'name'
  };
  varibales: any = [];
  data: any = [];

  label: any = [];
  data2: any = [];

  covidBarChart: any;

  data3: any;

  constructor(private resultClasification: ClasificationService, private variableService: VariableService, private dataService: DataService) {
    this.clasification = this.resultClasification.listClasification(this.filters).subscribe((data) => {


      for (const clasification of data.data) {
        if (clasification.name === "Corona Virus") {
          // console.log(clasification._id);
          this.getIdVaribale(variableService, dataService, clasification._id);

        }

      }

      // console.log(data.data[0]);

    });







    this.data3 = {
      labels: ['January'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: [65]
        }
      ]
    };

    console.log(this.data3);


    setTimeout(() => {

      this.covidBarChart = {
        labels: this.label,
        datasets: this.data2
      };
      console.log(this.covidBarChart);



    }, 2000);





  }

  ngOnInit() {




  }

  async getIdVaribale(variableService: VariableService, dataservice: DataService, id: string) {

    this.varibales = await variableService.getVariablesByClasification(id).subscribe((data) => {
      this.getDataVaribale(dataservice, data.data[0]._id);

    });

  }

  async getDataVaribale(dataService: DataService, id: string) {

    this.data = await dataService.listDatasPublic(this.filters, id).subscribe((data) => {

      //let dataSets: { label: string, data: Array, fill: boolean, borderColor: string };






      for (const dataCovid of data.data) {
        //console.log(dataCovid);
        let dataSets = {
          label: dataCovid.obj_Canton.name,
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: [Number(dataCovid.value)]

        };
        this.label.push(String(dataCovid.year));
        this.data2.push(dataSets);

        //  console.log(dataSets);


        // console.log(data2);
      }

      // console.log(this.data2);


    });





  }

}
