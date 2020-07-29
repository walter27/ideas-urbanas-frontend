import { Component, OnInit, Input } from '@angular/core';
import { TagService } from 'src/app/core/services/tag.service';
import { map } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import Word_Cloud from 'highcharts/modules/wordcloud';
import { type } from 'os';

@Component({
  selector: 'app-word-cloud',
  templateUrl: './word-cloud.component.html',
  styleUrls: ['./word-cloud.component.scss']
})
export class WordCloudComponent implements OnInit {

  stopwords: string[] = [];
  newTag = '';
  updateDemo: boolean;
  chartOptions: any = {};
  data: any = [];
  highcharts: any;
  tagsData: any[] = [];



  @Input() citySelected: any;






  constructor(private tagService: TagService) {

    this.updateDemo = false;
    this.highcharts = Highcharts;
    Word_Cloud(this.highcharts);
    this.data = [{
      "name": "PERCOCET",
      "weight": 10,
      "color": "#E0362C",
      "value": 31
    }, {
      "name": "MONITORING",
      "weight": 11,
      "color": "#E0362C",
      "value": 31
    }, {
      "name": "FINGER",
      "weight": 12,
      "color": "#646bb6",
      "value": 31
    }, {
      "name": "CONNECTED",
      "weight": 13,
      "color": "#E0362C",
      "value": 31
    }, {
      "name": "COMMODE",
      "weight": 14,
      "color": "#E0362C",
      "value": 31
    }, {
      "name": "CLOTTED",
      "weight": 15,
      "color": "#E0362C",
      "value": 31
    }, {
      "name": "INITIATED",
      "weight": 16,
      "color": "#E0362C",
      "value": 31
    }, {
      "name": "UPSET",
      "weight": 17,
      "color": "#E0362C",
      "value": 32
    }, {
      "name": "REVIEW",
      "weight": 18,
      "color": "#E0362C",
      "value": 32
    }, {
      "name": "LEVAQUIN",
      "weight": 19,
      "color": "#E0362C",
      "value": 32
    }, {
      "name": "FEEDING",
      "weight": 20,
      "color": "#f33585",
      "value": 32
    }, {
      "name": "DIFFERENT",
      "weight": 21,
      "color": "#E0362C",
      "value": 32
    }, {
      "name": "APPROPRIATE",
      "weight": 22,
      "color": "#E0362C",
      "value": 32
    }, {
      "name": "VITAL",
      "weight": 23,
      "color": "#E0362C",
      "value": 32
    }, {
      "name": "PROVIDED",
      "weight": 24,
      "color": "#E0362C",
      "value": 32
    }, {
      "name": "PLEASE",
      "weight": 25,
      "color": "#E0362C",
      "value": 33
    }, {
      "name": "KNEES",
      "weight": 26,
      "color": "#E0362C",
      "value": 33
    }, {
      "name": "#E0362C",
      "weight": 27,
      "color": "#E0362C",
      "value": 33
    }, {
      "name": "CCU",
      "weight": 28,
      "color": "#E0362C",
      "value": 33
    }, {
      "name": "BREAST",
      "weight": 29,
      "color": "#E0362C",
      "value": 33
    }, {
      "name": "20MG",
      "weight": 30,
      "color": "#E0362C",
      "value": 33
    }, {
      "name": "REFUSED",
      "weight": 31,
      "color": "#E0362C",
      "value": 33
    }, {
      "name": "PINK",
      "weight": 32,
      "color": "#E0362C",
      "value": 33
    }, {
      "name": "ULCER",
      "weight": 33,
      "color": "#E0362C",
      "value": 33
    }, {
      "name": "SIZE",
      "weight": 34,
      "color": "#E0362C",
      "value": 34
    }, {
      "name": "SHOWED",
      "weight": 35,
      "color": "#E0362C",
      "value": 34
    }]
  }


  ngOnInit() {

    if (this.citySelected) {
      this.getStopwords();
      this.listTags(this.citySelected._id);
      //this.createWordCloud();

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
      this.tagService.addTag({ text: element.toLowerCase().trim(), id_Canton: this.citySelected._id, type }).subscribe(data => {
        this.newTag = '';
        //this.step = 3;
        // if (index + 1 === words.length) {
        this.listTags(this.citySelected._id);
        // }

      }, err => {
        console.log(err);
      });
    }
  }


  listTags(cityId) {
    this.tagService.getTagsByCantByType(cityId).pipe(
      map(resp => {
        return resp;
      })
    ).subscribe(resp => {
      this.tagsData = [];

      resp.data.forEach((word: any) => {

        if (word.positive > word.negative && word.positive > word.neutro) {
          //console.log('POSITIVA', word);
          this.tagsData.push({
            name: word._id,
            weight: word.positive,
            color: '#008000'
          });

        }
        if (word.negative > word.positive && word.negative > word.neutro) {
          //console.log('NEGATIVA', word);
          this.tagsData.push({
            name: word._id,
            weight: word.negative,
            color: '#ff6633'
          });
        }

        if (word.neutro > word.positive && word.neutro > word.negative) {
          //console.log('NEUTRO', word);
          this.tagsData.push({
            name: word._id,
            weight: word.neutro,
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

      },

      series: [{
        type: 'wordcloud',
        data: this.tagsData,
        name: 'Value'
      }],
      title: {
        text: ''
      },
      exporting: {
        enabled: false,
      }


    }


  }

}
