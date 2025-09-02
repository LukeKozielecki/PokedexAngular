import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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
    const currentPath = this.document.location.pathname;
    console.log(currentPath)
    if (currentPath.startsWith('/en-US')) {
      this.currentLocale = 'en-US';
    } else if (currentPath.startsWith('/es')) {
      this.currentLocale = 'es';
    } else {
      this.currentLocale = null;
    }
  }

  changeLanguage(lang: string) {
    const currentPath = this.location.path();
    let newPath: string;
    if (currentPath.startsWith('/es') || currentPath.startsWith('/en-US')) {
      newPath = `/${lang}${currentPath.substring(currentPath.indexOf('/', 1))}`;
    } else {
      newPath = `/${lang}${currentPath}`;
    }

    this.document.location.href = this.document.location.origin + newPath;
  }
}
