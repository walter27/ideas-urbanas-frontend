import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TagService } from 'src/app/core/services/tag.service';
import { map } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import Word_Cloud from 'highcharts/modules/wordcloud';
import { type } from 'os';
import { RegionService } from 'src/app/core/services/region.service';

@Component({
  selector: 'app-word-cloud',
  templateUrl: './word-cloud.component.html',
  styleUrls: ['./word-cloud.component.scss']
})
export class WordCloudComponent implements OnInit, OnChanges {

  stopwords: string[] = [];
  newTag = '';
  updateDemo: boolean;
  chartOptions: any = {};
  data: any = [];
  highcharts: any;
  tagsData: any[] = [];
  citySelected: any;
  citySelectedWordCloud: any;
  columnaWordCloud: string;



  @Input('citySelectedId') citySelectedId: any;

  constructor(private tagService: TagService,
    private regionService: RegionService) {

    this.updateDemo = false;
    this.highcharts = Highcharts;
    Word_Cloud(this.highcharts);
  }


  ngOnInit() {


    this.citySelected = this.regionService.citySelect;
    this.citySelectedWordCloud = this.regionService.citySelectedWordCloud;
    if (this.citySelectedId) {
      this.getStopwords();
      this.listTags(this.citySelectedId);
      //this.createWordCloud();

    }
  }


  ngOnChanges(changes) {
    if (changes['citySelectedId']) {
      this.getStopwords();
      this.listTags(this.citySelectedId);
    }

    if (this.citySelectedId) {

      this.columnaWordCloud = 'col-lg-8';

    } else {
      this.columnaWordCloud = 'col-lg-6';

    }
  }

  getStopwords() {
    this.tagService.getStopwords().pipe(
      map(resp => {

        return resp;
      })
    ).subscribe(resp => {
      const { data } = resp;

      if (resp.data.length > 0) {
        this.stopwords = resp.data[0].stopwords;
      }
    });

  }

  parseStopword(sentence) {
    let finalSentence = [];
    const works = sentence.split(' ');
    works.forEach(c => {
      const result = this.stopwords.find(x => x === c.toUpperCase().trim());
      if (result === undefined) {
        finalSentence.push(c.toUpperCase().trim());
      }
    });
    return finalSentence;
  }

  onAddTag(value, type) {

    let words = this.parseStopword(value);
    for (let index = 0; index < words.length; index++) {
      const element = words[index];
      this.tagService.addTag({ text: element.toLowerCase().trim(), id_Canton: this.citySelectedId, type }).subscribe(data => {
        this.newTag = '';
        //this.step = 3;
        // if (index + 1 === words.length) {
        this.listTags(this.citySelectedId);
        // }

      }, err => {
        console.log(err);
      });
    }
  }


  listTags(cityId) {
    let weight: number;
    this.tagService.getTagsByCantByType(cityId).pipe(
      map(resp => {
        return resp;
      })
    ).subscribe(resp => {
      this.tagsData = [];

      resp.data.forEach((word: any) => {

        if (word.positive > word.negative && word.positive > word.neutro) {
          //console.log('POSITIVA', word);

          if (word.positive >= 16) {
            weight = 24;

          }
          if (word.positive > 12 && word.positive <= 14) {
            weight = 21;

          }
          if (word.positive > 10 && word.positive <= 12) {
            weight = 18;

          }
          if (word.positive > 8 && word.positive <= 10) {
            weight = 15;

          }
          if (word.positive > 6 && word.positive <= 8) {
            weight = 12;

          }

          if (word.positive > 4 && word.positive <= 6) {
            weight = 9;

          }

          if (word.positive > 2 && word.positive <= 4) {
            weight = 6;

          }

          if (word.positive > 0 && word.positive <= 2) {
            weight = 3;

          }
          this.tagsData.push({
            name: word._id,
            weight,
            color: '#008000'
          });

        }
        if (word.negative > word.positive && word.negative > word.neutro) {
          //console.log('NEGATIVA', word);

          if (word.negative >= 16) {
            weight = 24;

          }

          if (word.negative > 12 && word.negative <= 14) {
            weight = 21;

          }

          if (word.negative > 10 && word.negative <= 12) {
            weight = 18;

          }

          if (word.negative > 8 && word.negative <= 10) {
            weight = 15;

          }


          if (word.negative > 6 && word.negative <= 8) {
            weight = 12;

          }
          if (word.negative > 4 && word.negative <= 6) {
            weight = 9;

          }

          if (word.negative > 2 && word.negative <= 4) {
            weight = 6;

          }

          if (word.negative > 0 && word.negative <= 2) {
            weight = 3;

          }
          this.tagsData.push({
            name: word._id,
            weight,
            color: '#ff6633'
          });
        }

        if (word.neutro > word.positive && word.neutro > word.negative) {
          //console.log('NEUTRO', word);

          if (word.neutro >= 16) {
            weight = 24;

          }
          if (word.neutro > 12 && word.neutro <= 14) {
            weight = 21;

          }
          if (word.neutro > 10 && word.neutro <= 12) {
            weight = 18;

          }
          if (word.neutro > 8 && word.neutro <= 10) {
            weight = 15;

          }
          if (word.neutro > 6 && word.neutro <= 8) {
            weight = 12;

          }
          if (word.neutro > 4 && word.neutro <= 6) {
            weight = 9;

          }

          if (word.neutro > 2 && word.neutro <= 4) {
            weight = 6;

          }

          if (word.neutro > 0 && word.neutro <= 2) {
            weight = 3;

          }
          this.tagsData.push({
            name: word._id,
            weight,
            color: '#696969'
          });

        }


      });

      this.createWordCloud();

    });
  }

  createWordCloud() {

    this.chartOptions = {

      chart: {
        plotBorderWidth: 0,
        animation: true,
        backgroundColor: 'transparent',
        plotBackgroundImage: 'assets/nube/nube-homepage-1.png'


      },

      series: [{
        type: 'wordcloud',
        data: this.tagsData,
        name: 'Value',
        spiral: 'rectangular',
        placementStrategy: 'center',
        rotation: {
          from: 0,
          to: 0
        },
      }],
      title: {
        text: ''
      },
      tooltip: {
        enabled: false
      },

      exporting: {
        enabled: false,
      }

    }


  }

}
