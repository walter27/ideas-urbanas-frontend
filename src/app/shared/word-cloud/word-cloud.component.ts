import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { TagService } from "src/app/core/services/tag.service";
import { map } from "rxjs/operators";
import { RegionService } from "src/app/core/services/region.service";
import { Router } from "@angular/router";
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { Observable } from 'rxjs';


//require('../../../assets/js/wordcloud')(Highcharts);


@Component({
  selector: "app-word-cloud",
  templateUrl: "./word-cloud.component.html",
  styleUrls: ["./word-cloud.component.scss"],
})
export class WordCloudComponent implements OnInit, OnChanges {
  stopwords: string[] = [];
  newTag = "";
  citySelected: any;
  citySelectedWordCloud: any;
  background: string;


  options: CloudOptions = {};

  dataCloud: Observable<CloudData[]>

  dataWord: any = [];

  @Input("citySelectedId") citySelectedId: any;

  constructor(
    private tagService: TagService,
    private regionService: RegionService,
    private route: Router
  ) { }

  ngOnInit() {
    this.citySelected = this.regionService.citySelect;
    this.citySelectedWordCloud = this.regionService.citySelectedWordCloud;
    /* if (this.citySelectedId) {
       this.getStopwords();
       this.listTags(this.citySelectedId);
       //this.createWordCloud();
     }*/
  }

  ngOnChanges(changes) {
    if (changes["citySelectedId"]) {
      this.getStopwords();
      this.listTags(this.citySelectedId);
    }

    if (
      this.route.url === "/intermediate-cities" ||
      this.route.url === "/home"
    ) {
      this.background = "assets/nube/nube-homepage-1.png ";
    } else {
      this.background = "assets/nube/nube-ciudades-1.png";
    }
  }

  getStopwords() {
    this.tagService
      .getStopwords()
      .pipe(
        map((resp) => {
          return resp;
        })
      )
      .subscribe((resp) => {
        const { data } = resp;

        if (resp.data.length > 0) {
          this.stopwords = resp.data[0].stopwords;
        }
      });
  }

  parseStopword(sentence) {
    let finalSentence = [];
    const works = sentence.split(" ");
    works.forEach((c) => {
      const result = this.stopwords.find((x) => x === c.toUpperCase().trim());
      if (result === undefined) {
        finalSentence.push(c.toUpperCase().trim());
      }
    });
    return finalSentence;
  }

  onAddTag(value, type) {
    let words = this.parseStopword(value);
    for (let index = 0; index < words.length; index++) {
      const element = words[index].toLowerCase().trim();

      this.tagService.addWord({ text: element }).subscribe();

      setTimeout(() => {
        this.tagService.getWord({ text: element }).subscribe((data: any) => {


          this.tagService
            .addTag({
              id_Word: data.data._id,
              id_Canton: this.citySelectedId,
            })
            .subscribe(
              (data) => {
                this.newTag = "";
                //this.step = 3;
                // if (index + 1 === words.length) {
                this.listTags(this.citySelectedId);
                // }
              },
              (err) => {
                console.log(err);
              }
            );

        });

      }, 1000);





    }
  }

  listTags(cityId) {

    this.dataWord = [];


    let weight: number;
    this.tagService
      .getTagsByCantByType(cityId)
      .pipe(
        map((resp) => {
          return resp;
        })
      )
      .subscribe((resp) => {
        // console.log(resp.data);
        let count = 0;

        resp.data.forEach((word: any) => {
          let weight = 0;
          if (word.positive > word.negative && word.positive > word.neutro) {

            if (word._id.length >= 26 && word.positive >= 1000) {

              weight = 250;
              count = count + word.positive;

            } else {
              weight = word.positive
              count = count + word.positive;
            }

            this.dataWord.push({
              text: word._id,
              weight,
              color: "#008000",
            });
          }


          if (word.negative > word.positive && word.negative > word.neutro) {

            if (word._id.length >= 26 && word.negative >= 1000) {

              weight = 250;
              count = count + word.negative;

            } else {
              weight = word.negative
              count = count + word.negative;
            }

            this.dataWord.push({
              text: word._id,
              weight,
              color: "#ff6633",
            });
          }

          if (word.neutro > word.positive && word.neutro > word.negative) {

            if (word._id.length >= 26 && word.neutro >= 1000) {

              weight = 250;
              count = count + word.neutro;

            } else {
              weight = word.neutro
              count = count + word.neutro;
            }

            this.dataWord.push({
              text: word._id,
              weight,
              color: "#696969",
            });


          }
        });

        this.createWordCloud(count);
      });
  }




  createWordCloud(count) {

    let height = 0

    if (count === 15) {
      height = 200
    } else {
      height = 500
    }

    console.log(count);

    this.options = {
      width: 0.98,
      height,
      overflow: false,
      realignOnResize: true,
      randomizeAngle: true,
      step: 5,

    }
    this.dataCloud = this.dataWord

  }
}
