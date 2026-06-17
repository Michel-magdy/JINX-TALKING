import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'img[loading]',
  standalone: true
})
export class ImgLoaderDirective {
  @HostBinding('class.loaded') isLoaded = false;

  @HostListener('load')
  onLoad() {
    this.isLoaded = true;
  }
}
