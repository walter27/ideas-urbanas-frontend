import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ides-ui';
  device = 'movil';
  constructor(translate: TranslateService) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');
    if (sessionStorage.getItem('language')) {
      translate.use(sessionStorage.getItem('language'));
    } else {
      translate.use('es');
      sessionStorage.setItem('language', 'es');
    }
    if (window.innerWidth > 767)
      this.device = 'normal';
    else
      this.device = 'mobile';
  }
}
