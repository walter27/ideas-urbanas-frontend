import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

declare var gtag;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "ides-ui";
  device = "movil";
  constructor(translate: TranslateService, private router: Router) {

    //Google Analytics
    const navEndEvents$ = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      );

    navEndEvents$.subscribe((event: NavigationEnd) => {
      gtag('config', 'G-3FDGYVP7JD', {
        'page_path': event.urlAfterRedirects
      });
    });

    translate.addLangs(["en", "es"]);
    translate.setDefaultLang("es");
    if (sessionStorage.getItem("language")) {
      translate.use(sessionStorage.getItem("language"));
    } else {
      translate.use("es");
      sessionStorage.setItem("language", "es");
    }
    if (window.innerWidth > 767) this.device = "normal";
    else this.device = "mobile";
  }
}
