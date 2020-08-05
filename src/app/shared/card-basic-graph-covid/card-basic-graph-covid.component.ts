import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_export from 'highcharts/modules/export-data';
import Color_Axis from 'highcharts/modules/coloraxis';
import Series_Label from 'highcharts/modules/series-label';
import { Facebook } from 'angular-feather/icons';



@Component({
  selector: 'app-card-basic-graph-covid',
  templateUrl: './card-basic-graph-covid.component.html',
  styleUrls: ['./card-basic-graph-covid.component.scss']
})
export class CardBasicGraphCovidComponent implements OnInit, OnChanges {

  highcharts: any;
  updateDemo: boolean;
  chartOptions: any = {};
  socialMedia: any = [];
  imageURL: string;

  @Input("dates") dates: any[];
  @Input("data") data: any[];
  @Input('variable') variable: any;


  constructor() {

    this.updateDemo = false;
    this.highcharts = Highcharts;
    HC_exporting(this.highcharts);
    HC_export(this.highcharts);
    Color_Axis(this.highcharts);
    //Series_Label(this.highcharts);


  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (changes['data']) {
      this.createBarChart();
    }
  }

  createBarChart() {


    this.chartOptions = {
      chart: {
        type: "column",
        animation: true,
        borderColor: '#000000',
        borderRadius: 20,
        borderWidth: 1,

      },
      title: {
        text: `Casos ${this.variable.name}`,
        style: {
          color: '#243554',
          fontWeight: 'bold',
          font: 'Roboto, sans-serif',
        }
      },
      xAxis: {
        categories: this.dates,

      },
      colorAxis: {

        minColor: '#ffeda0',
        maxColor: '#bd0026',

      },
      yAxis: {
        title: {
          text: 'Número de casos'
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        enabled: true,
        crosshairs: true
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            crop: false,
            overflow: 'none',
            align: 'left',
            inside: true,
            format: '{series.name}',
            rotation: 270,
            color: 'black'
          }
        }
      },
      exporting: {
        filename: `casos_${this.variable.name}_covid19`
      },
      series: this.data
    };

    this.updateDemo = true;

    this.getURLImage();

  }


  getURLImage() {

    let chart = this.highcharts.charts[0];
    let ohlcSvg = chart.getSVG(this.chartOptions);
    let urlExport = this.highcharts.getOptions().exporting.url;

    //console.log(this.highcharts.getOptions().exporting);

    let data = {
      options: JSON.stringify(this.chartOptions),
      filename: 'test.png',
      type: 'image/png',
      async: true
    };

    let that = this;


    $.post(urlExport, data, function (url) {
      that.socialMedia = [];
      this.imageURL = urlExport + url;

      that.socialMedia.push({
        name: 'Facebook',
        link: `https://www.facebook.com/sharer.php?u=${this.imageURL}`,
        img: 'social-facebook'

      });

      that.socialMedia.push({
        name: 'Twitter',
        link: `https://twitter.com/intent/tweet?url=${this.imageURL}&text=Plataforma de Ideas Urbanas`,
        img: 'social-twitter'

      });




      /*var urlCreator = window.URL || window.webkitURL
      document.querySelector("#image").src = imageUrl
      fetch(imageUrl).then(response => response.blob()).then(data => {
        // You have access to chart data here
        //console.log(data)
      })*/
    });




    //console.log(ohlcSvg);
    //console.log(this.highcharts.getOptions().exporting.url);
    //console.log(this.chartOptions);





    /*$('#facebook').click(function () {


      function serialize(obj) {
        return Object.keys(obj).map(function (p) {
          return encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]);
        }).join("&");
      }

      function postToFacebook(url) {
        console.log(url);
        let url2 = urlExport + url;
        console.log(url2);

        /*const title = 'Laboratorio';
        window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(url2) + '&t=' +
          encodeURIComponent(title), 'sharer', 'toolbar=0,status=0,width=626,height=436');
      }


      $.ajax({
        type: 'POST',
        data: serialize({
          svg: ohlcSvg,
          type: 'image/png',
          async: true
        }),
        url: urlExport,
        success: postToFacebook,
        error: function (e) {
          throw e;
        }
      });
    });*/

  }

}



