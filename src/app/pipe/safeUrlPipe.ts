import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(
    private sanitizer: DomSanitizer
  ) { }

  transform(url: string) {
    if (url && url.startsWith("WS:")) {
      url = url.substr(3);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}