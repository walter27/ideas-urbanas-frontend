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



  @Input('citySelectedId') citySelectedId: any;

  constructor(private tagService: TagService,
              private regionService: RegionService) {

    this.updateDemo = false;
    this.highcharts = Highcharts;
    Word_Cloud(this.highcharts);
  }


  ngOnInit() {


    this.citySelected = this.regionService.citySelect;
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
