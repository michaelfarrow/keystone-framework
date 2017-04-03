import { Component } from '@angular/core';
import { WindowRef } from './WindowRef';

@Component({
  selector: 'my-app',
  providers: [WindowRef],
  template: require('./app.component.html'),
  styles: [ require('./app.component.css') ],
})
export class AppComponent {
  title = 'Keystone';
  version = '0';
  constructor(private winRef: WindowRef) {
    this.version = winRef.nativeWindow.version;
  }
}
