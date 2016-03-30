/// <reference path="../node_modules/angular2/typings/browser.d.ts" />

import {Component, enableProdMode, Input, provide, ViewEncapsulation, PLATFORM_PIPES, PLATFORM_DIRECTIVES} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, LocationStrategy, HashLocationStrategy, RouterLink} from 'angular2/router';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS, SidenavService, Media} from "ng2-material/all";
import {TRANSLATE_PROVIDERS, TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

import {BaseApp, SearchBarDirective, InfoDirective, AlertDirective, ConfirmDirective, ImagePipe} from './engine/all';
import {Settings} from './settings';

import {HomeCmp} from './components/home/home';
import {AboutCmp} from './components/about/about';
import {UsersCmp} from './components/users/users';

@Component({
  selector: 'app',
  templateUrl: 'main.html',
  encapsulation: ViewEncapsulation.None,
  providers :[SidenavService],
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES],
  pipes: [TranslatePipe]
})
@RouteConfig([
  { path: '/home', component: HomeCmp, as: 'Home', useAsDefault: true },
  { path: '/about', component: AboutCmp, as: 'About' },
  { path: '/users/...', component: UsersCmp, as: 'Users' }
])
export class AppCmp extends BaseApp {

  constructor(private translate: TranslateService) {
    super(translate);
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
  provide(PLATFORM_PIPES, {useValue: TranslatePipe, multi: true}),
  provide(PLATFORM_PIPES, {useValue: ImagePipe, multi: true})
]);
