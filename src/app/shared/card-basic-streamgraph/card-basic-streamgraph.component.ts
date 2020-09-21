import { Component, OnInit, OnChanges, Input } from "@angular/core";
import * as Highcharts from "highcharts";
import HC_exporting from "highcharts/modules/exporting";
import HC_export from "highcharts/modules/export-data";
import Color_Axis from "highcharts/modules/coloraxis";
import Series_Label from "highcharts/modules/series-label";
import Streamgraph from "highcharts/modules/streamgraph";
import { ChartsService } from "src/app/core/services/charts.service";
import { TranslateService } from '@ngx-translate/core';


Streamgraph(Highcharts);
HC_exporting(Highcharts);
HC_export(Highcharts);
Color_Axis(Highcharts);
Series_Label(Highcharts);

@Component({
  selector: "app-card-basic-streamgraph",
  templateUrl: "./card-basic-streamgraph.component.html",
  styleUrls: ["./card-basic-streamgraph.component.scss"],
})
export class CardBasicStreamgraphComponent implements OnInit, OnChanges {
  highcharts: any;
  updateDemo: boolean;
  chartOptions: any = {};
  chartOptionsExport: any = {};
  title; string;
  downloadPNG: string;
  donwloadJPEG: string;
  downloadSVG: string;
  downloadPDF: string;
  downloadCSV: string;
  downloadXLS: string;
  socialMedia: any = [
    {
      name: "Facebook",
      link: "",
      img: "social-facebook",
    },
    {
      name: "Twitter",
      link: "",
      img: "social-twitter",
    },
  ];

  @Input("dates") dates: any[];
  @Input("data") data: any[];
  @Input("min") min: number;
  @Input("max") max: number;
  @Input("variable") variable: any;
  @Input() maxExport: number;

  constructor(
    private chartService: ChartsService,
    private translateService: TranslateService) {
    this.updateDemo = false;
    this.highcharts = Highcharts;

  }

  ngOnInit() { }

  ngOnChanges(changes) {
    if (changes["data"] && this.data.length > 0) {
      this.translate();
      //this.createStreamGraph();
    }
  }

  createStreamGraph() {

    this.chartOptions = {
      chart: {
        type: "streamgraph",
        animation: true,
        marginBottom: 120,
        borderColor: "#000000",
        borderRadius: 20,
        borderWidth: 1,
        //zoomType: 'x',
        /* events: {
           afterSetExtremes: function () {
             console.log(this.getExtremes());
           }
         }*/
      },
      title: {
        text: this.title,
        style: {
          color: "#243554",
          fontWeight: "bold",
          font: "Roboto, sans-serif",
        },
      },
      xAxis: {
        type: "categories",
        min: this.min,
        max: this.max,
        crosshair: true,
        categories: this.dates,
        labels: {
          align: "right",
          reserveSpace: false,
          rotation: 270,
        },

        /*events: {
          setExtremes: function (e) {


            console.log(e);


          },

          afterSetExtremes: function () {
            console.log(this.getExtremes());
          }
        },*/
      },
      /* colorAxis: {
 
         minColor: '#ffeda0',
         maxColor: '#bd0026',
 
       },*/
      yAxis: {
        visible: false,
        startOnTick: false,
        endOnTick: false,
      },

      legend: {
        enabled: false,
      },
      exporting: {
        filename: `casos_${this.variable.name}_covid19_temporal`,
        buttons: {
          contextButton: {
            menuItems: [
              {
                text: this.downloadPNG, onclick() { this.exportChart({ type: 'image/png' }); }
              },
              {
                text: this.donwloadJPEG, onclick() { this.exportChart({ type: 'image/jpeg' }); }
              },
              {
                text: this.downloadSVG, onclick() { this.exportChart({ type: 'image/svg+xml' }); }
              },
              {
                text: this.downloadPDF, onclick() { this.exportChart({ type: 'application/pdf' }); }
              },
              {
                text: this.downloadCSV, onclick() { this.downloadCSV(); }
              },
              {
                text: this.downloadXLS, onclick() { this.downloadXLS(); }
              },
            ]
          }
        }
      },
      series: this.data,
    };

    setTimeout(() => {
      this.getURLImage();
    }, 3000);
  }

  getURLImage() {
    this.chartOptionsExport = Object.assign({}, this.chartOptions);
    this.chartOptionsExport.xAxis.min = 0;
    this.chartOptionsExport.xAxis.max = this.maxExport;

    this.chartOptionsExport["legend"] = {
      layout: "vertical",
      align: "left",
      verticalAlign: "middle",
      itemMarginTop: 10,
      itemMarginBottom: 10,
    };

    this.chartOptionsExport["subtitle"] = {
      text: this.variable.name
    }

    let chartsDetails = {
      type: "jpeg",
      options: this.chartOptionsExport,
    };
    this.chartService.generateImage(chartsDetails).subscribe((resp) => { });

    //let chart = this.highcharts.charts[0];
    //let ohlcSvg = chart.getSVG(chartOptionsExport);

    /*let urlExport = this.highcharts.getOptions().exporting.url;

    let data = {
      options: JSON.stringify(this.chartOptionsExport),
      filename: "test.png",
      type: "image/png",
      width: 450,
      async: true,
    };

    let that = this;

    $.post(urlExport, data, function (url) {
      that.socialMedia = [];
      that.imageURL = urlExport + url;

      that.socialMedia.push({
        name: "Facebook",
        link: `https://www.facebook.com/sharer.php?u=${that.imageURL}`,
        img: "social-facebook",
      });

      that.socialMedia.push({
        name: "Twitter",
        link: `https://twitter.com/intent/tweet?url=${that.imageURL}&text=Plataforma de Ideas Urbanas`,
        img: "social-twitter",
      });

      /*var urlCreator = window.URL || window.webkitURL
      document.querySelector("#image").src = imageUrl
      fetch(imageUrl).then(response => response.blob()).then(data => {
        // You have access to chart data here
        //console.log(data)
      })
    });*/

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

  sharedImage(item) {
    this.variable["type"] = this.chartOptions.chart.type;
    this.chartService.shareImage(this.variable).subscribe(async resp => {
      this.socialMedia[0].link = await `https://www.facebook.com/sharer.php?u=${resp}`;
      this.socialMedia[1].link = await `https://twitter.com/intent/tweet?url=${resp}&text=Plataforma de Ideas Urbanas`;
    });

    setTimeout(() => {

      if (item.link) {
        window.open(item.link, "blank");


      } else {
        console.log('LINK', item.link);

      }


    }, 1000);

  }


  translate() {

    this.translateService.stream(['title_streamgraph', 'downloadPNG', 'downloadJPEG', 'downloadSVG', 'downloadPDF', 'downloadCSV', 'downloadXLS']).subscribe(title => {


      Object.keys(title).forEach((key) => {

        if (key === 'title_streamgraph') {
          this.title = title[key];
        }
        if (key === 'downloadPNG') {
          this.downloadPNG = title[key];
        }
        if (key === 'downloadJPEG') {
          this.donwloadJPEG = title[key];
        }
        if (key === 'downloadSVG') {
          this.downloadSVG = title[key];
        }
        if (key === 'downloadPDF') {
          this.downloadPDF = title[key];
        }
        if (key === 'downloadCSV') {
          this.downloadCSV = title[key];
        }
        if (key === 'downloadXLS') {
          this.downloadXLS = title[key];
        }
      });

      this.createStreamGraph();

    });

  }
}
