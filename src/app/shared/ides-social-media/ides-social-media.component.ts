import { Component, OnInit, OnChanges, Input } from "@angular/core";
import { ChartsService } from "src/app/core/services/charts.service";

@Component({
  selector: "app-ides-social-media",
  templateUrl: "./ides-social-media.component.html",
  styleUrls: ["./ides-social-media.component.scss"],
})
export class IdesSocialMediaComponent implements OnInit, OnChanges {


  @Input() chartDetails;
  @Input() variable;

  imageServer: any;

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

  constructor(private chartService: ChartsService) { }

  ngOnInit() { }

  ngOnChanges() {

  }


  async getURLImage(item) {

    this.chartService.generateImage(this.chartDetails, this.variable).subscribe(async (resp) => {

      this.imageServer = await resp;

      if (item.name === 'Facebook') {

        item.link = `https://www.facebook.com/sharer.php?u=${this.imageServer}`
        this.shareimage(item);

      }

      if (item.name === 'Twitter') {

        item.link = `https://twitter.com/intent/tweet?url=${this.imageServer}&text=Plataforma de Ideas Urbanas`
        this.shareimage(item);

      }

      /* this.socialMedia[0].link = await `https://www.facebook.com/sharer.php?u=${this.imageServer}`;
       this.socialMedia[1].link = await `https://twitter.com/intent/tweet?url=${this.imageServer}&text=Plataforma de Ideas Urbanas`;
 
       console.log(this.socialMedia);*/

    });

  }


  shareimage(item) {

    if (item.link) {
      window.open(item.link, "blank");

    } else {
      console.log('error');

    }
  }


}
