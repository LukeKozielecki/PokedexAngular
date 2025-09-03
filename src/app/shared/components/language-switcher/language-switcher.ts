import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {getCurrentLocale, getNewLanguagePath} from '../../utils/locale.utils';

/**
 * Component responsible for switching language block between Spanish and English.
 * As per current implementation this works if deployed on proper local server, as angular `ng serve`
 * command does not allow for multi-locale local deployment.
 *
 * @remarks This language switcher is a proof of concept. If there were more languages to be added,
 * this would have to be changed for dropdown menu with more robust check.
 * As per current implementation it is called in `search-form.component.ts`
 * This would have to probably be moved to header, or similar shared component.
 */
@Component({
  selector: 'app-language-switcher',
  imports: [],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss'
})
export class LanguageSwitcher implements OnInit, OnDestroy {
  currentLocale: string | null = null;
  private routerSubscription: Subscription | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateLocale();
      });
    this.updateLocale();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private updateLocale() {
    this.currentLocale = getCurrentLocale(this.document.location.pathname);
  }

  changeLanguage(lang: string) {
    const currentPath = this.location.path();
    const newPath = getNewLanguagePath(currentPath, lang);
    this.document.location.href = this.document.location.origin + newPath;
  }
}
