import { Component, OnInit} from '@angular/core';
import { ClasificationService } from '../../../../core/services/clasification.service';
import { VariableService } from '../../../../core/services/variable.service';
import { DataService } from '../../../../core/services/data.service';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_export from 'highcharts/modules/export-data';
import { SelectItem } from 'primeng/api';



interface City {
  name: string;

}




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

  data6: any;
  dataHigcharts: any = [];

  //highcharts = Highcharts;
  chartOptions: any = {};
  chartOptions6: any = {};

  highcharts: any;

  cities: City[];


  selectedCities: City[];









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


    //HIGCHARTS

    setTimeout(() => {

      this.covidBarChart = {
        labels: this.label,
        datasets: this.data2
      };

      this.highcharts = Highcharts;
      HC_exporting(Highcharts);
      HC_export(Highcharts);
      this.chartOptions6 = {
        chart: {
          type: "column"
        },
        title: {
          text: "Casos confirmados de covid"
        },
        xAxis: {
          categories: this.label
        },
        yAxis: {
          title: {
            text: "Casos Confirmados"
          }
        },
        series: this.dataHigcharts
      };




    }, 2000);

    console.log(this.data2);

    //console.log(this.);
    this.cities = this.data2;


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


      for (const dataCovid of data.data) {
        //console.log(dataCovid);
        let dataSets = {
          name: dataCovid.obj_Canton.name,


        };

        let dataCovi = {
          data: [Number(dataCovid.value)],
          name: dataCovid.obj_Canton.name


        };
        this.label.push(String(dataCovid.year));
        this.data2.push(dataSets);
        this.dataHigcharts.push(dataCovi);

        //  console.log(dataSets);


        // console.log(data2);
      }



    });





  }

}
