import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

/**
 * A service for managing and dispatching scroll-related events.
 * This service allows different parts of the application to request
 * a scroll-to-top action without direct coupling.
 */
@Injectable({
  providedIn: 'root'
})
export class ScrollToTopService {
  private readonly scrollToTopSubject = new Subject<void>();

  /**
   * An Observable that components can subscribe to in order to react
   * to scroll-to-top requests.
   */
  readonly scrollToTopRequested$: Observable<void> = this.scrollToTopSubject.asObservable()

  constructor() {
    this.scrollToTopRequested$.subscribe(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * Triggers a request to scroll the window to the top.
   * Components like the header can call this method to signal the need for a scroll.
   */
  public requestScrollToTop(): void {
    this.scrollToTopSubject.next();
  }
}
