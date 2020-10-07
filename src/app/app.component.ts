import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { routerTransitions } from './_animations/routerTransistions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routerTransitions]
})
export class AppComponent {
  title = 'Frontend';

  constructor(public router: Router) {}

  prepareRoute(outlet: RouterOutlet) {
    return outlet.activatedRouteData.animation;
  }
}
