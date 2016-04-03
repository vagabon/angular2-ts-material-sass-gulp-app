/// <reference path="../node_modules/angular2/typings/browser.d.ts" />

import {Component, enableProdMode, provide, ViewEncapsulation, PLATFORM_PIPES, PLATFORM_DIRECTIVES} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, LocationStrategy, HashLocationStrategy, RouterLink} from 'angular2/router';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {MATERIAL_DIRECTIVES} from "ng2-material/all";
import {TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

import {BaseApp, SearchBarDirective, InfoDirective, AlertDirective, ConfirmDirective, ImagePipe, UrlService, RoleDirective, OwnerDirective} from './engine/all';
import {Settings} from './settings';

import {HomeCmp} from './components/home/home';
import {AboutCmp} from './components/about/about';
import {LoginComponent} from './components/login/login';
import {UsersCmp} from './components/users/users';

@Component({
  selector: 'app',
  templateUrl: 'components/body.html',
  encapsulation: ViewEncapsulation.None,
  providers :[],
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES, RoleDirective, OwnerDirective],
  pipes: [TranslatePipe]
})
@RouteConfig([
  { path: '/home', component: HomeCmp, as: 'Home', useAsDefault: true },
  { path: '/about', component: AboutCmp, as: 'About' },
  { path: '/login', component: LoginComponent, as: 'Login' },
  { path: '/users/...', component: UsersCmp, as: 'Users' }
])
export class AppCmp extends BaseApp {

  urlService:UrlService;
  url;
  username;
  userId;
  history = [];

  constructor(private translate: TranslateService, public http:Http) {
    super(translate);
    this.urlService = new UrlService(http, "");
    this.username = 'anonymous';
  }

  ngDoCheck() {
    if (Settings.USER) {
      if (this.username != Settings.USER.username) {
        this.username = Settings.USER.username;
        this.userId = Settings.USER.id;
      }
    }
    if (this.url != window.location.hash) {
      this.url = window.location.hash;
      document.getElementById("errorContent").style.display = "none";
      this.history.push(this.url);
    }
  }

  back() {
    window.location.hash = this.history[this.history.length - 2];
    this.history.pop();
    this.history.pop();
  }

  logout() {
    Settings.TOKEN = '';
    Settings.USER = { id: 0, 'username': '', 'role': '' };
    localStorage.setItem("USER", null);
    localStorage.setItem("TOKEN", null);
    Settings.USER.username= 'anonymous';
    window.location.hash = "#/login";
  }
}

if (Settings.PROD) {
  enableProdMode();
}

bootstrap(<any>AppCmp, [ROUTER_PROVIDERS, provide(LocationStrategy, { useClass: HashLocationStrategy }), HTTP_PROVIDERS,
  provide(TranslateLoader, {
    useFactory: (http: Http) => new TranslateStaticLoader(http, 'i18n', '.json'),
    deps: [Http]
  }),
  TranslateService,
  provide(PLATFORM_DIRECTIVES, {useValue: MATERIAL_DIRECTIVES, multi: true}),
  provide(PLATFORM_DIRECTIVES, {useValue: RouterLink, multi: true}),
  provide(PLATFORM_DIRECTIVES, {useValue: InfoDirective, multi: true}),
  provide(PLATFORM_DIRECTIVES, {useValue: ConfirmDirective, multi: true}),
  provide(PLATFORM_DIRECTIVES, {useValue: SearchBarDirective, multi: true}),
  provide(PLATFORM_DIRECTIVES, {useValue: AlertDirective, multi: true}),
  provide(PLATFORM_DIRECTIVES, {useValue: RoleDirective, multi: true}),
  provide(PLATFORM_DIRECTIVES, {useValue: OwnerDirective, multi: true}),
  provide(PLATFORM_PIPES, {useValue: TranslatePipe, multi: true}),
  provide(PLATFORM_PIPES, {useValue: ImagePipe, multi: true})
]);
