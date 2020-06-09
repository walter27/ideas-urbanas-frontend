import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Directive({
  selector: '[appAllowMenuItem]'
})
export class AllowMenuItemDirective {

  @Input()
  set appAllowMenuItem(item) {
    this.renderElement(item);
  }

  constructor(
    private template: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  renderElement(item) {
    if (item.onlyAdmin) {
      if (this.authService.isAuthenticated()) {
        this.viewContainer.createEmbeddedView(this.template);
      } else {
        this.viewContainer.clear();
      }
    } else if (item.onlyAdmin == undefined) {
      this.viewContainer.createEmbeddedView(this.template);
    }
  }

}
