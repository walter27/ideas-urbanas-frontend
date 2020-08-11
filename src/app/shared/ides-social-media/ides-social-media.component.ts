import { Component, OnInit, OnChanges, Input } from "@angular/core";
import { ChartsService } from "src/app/core/services/charts.service";

@Component({
  selector: "app-ides-social-media",
  templateUrl: "./ides-social-media.component.html",
  styleUrls: ["./ides-social-media.component.scss"],
})
export class IdesSocialMediaComponent implements OnInit, OnChanges {
  @Input("imageBase64") imageBase64;
  variable: any;

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

  constructor(private chartService: ChartsService) {}

  ngOnInit() {}

  ngOnChanges(changes) {
    if (changes["imageBase64"] && this.imageBase64) {
      this.chartService
        .saveImageBase64(this.imageBase64)
        .subscribe((resp) => {});
    }
  }

  sharedImage(item) {
    this.variable = {
      type: this.imageBase64.type,
      name: this.imageBase64.name,
    };
    this.chartService.shareImage(this.variable).subscribe((resp) => {
      this.socialMedia[0].link = `https://www.facebook.com/sharer.php?u=${resp}`;
      this.socialMedia[1].link = `https://twitter.com/intent/tweet?url=${resp}&text=Plataforma de Ideas Urbanas`;
    });

    setTimeout(() => {
      if (item.link) {
        window.open(item.link, "blank");
      }
    }, 1000);
  }
}
