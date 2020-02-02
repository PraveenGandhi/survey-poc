import {Router, RouterConfiguration} from 'aurelia-router';

export class AppVM {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Survey';
    config.map([
      { route: ['', 'questions'], name: 'questions',      moduleId: 'routes/questions',      nav: true, title: 'Fill Survey' },
    ]);

    this.router = router;
  }
}