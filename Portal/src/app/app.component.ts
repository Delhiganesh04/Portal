import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <!-- <app-layout></app-layout> -->
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'Portals';
}
