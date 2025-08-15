import {Component, HostListener, OnDestroy, OnInit, signal} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {ScrollToTopService} from '../../services/scroll-to-top.service';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-pokemon-compendium-header',
  imports: [
    NgOptimizedImage,
    MatIconModule
  ],
  templateUrl: './pokemon-compendium-header.html',
  styleUrl: './pokemon-compendium-header.scss',
  host: { '[class.scrolled]': 'hasScrolled()' }
})
export class PokemonCompendiumHeaderComponent implements OnInit, OnDestroy {

  hasScrolled = signal(false);

  /**
   * The scroll position (in pixels) beyond which the header will shrink.
   */
  private readonly SCROLL_THRESHOLD_SHRINK = 100;
  /**
   * The scroll position (in pixels) at or below which the header will return to its original size.
   */
  private readonly SCROLL_THRESHOLD_RESTORE = 20;
  /**
   * Cooldown period (in milliseconds) after a state change to prevent rapid, successive updates during scrolling.
   */
  private readonly COOLDOWN_TIME = 200;
  /**
   * Delay in milliseconds before emitting the scroll-to-top request.
   *
   * This delay ensures the header's "growth" animation can initiate before
   * the page starts scrolling to the top, preventing premature exit.
   */
  private readonly SCROLL_TO_TOP_EMIT_DELAY_MS = 20;

  private isChangingState = false;
  /**
   * Holds the ID of the setTimeout for the cooldown period.
   * Used to prevent rapid state changes during scrolling.
   */
  private cooldownTimeout: number | undefined;

  constructor(
    private scrollService: ScrollToTopService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.onScrollRequest();
  }

  ngOnDestroy(): void {
    if (this.cooldownTimeout) {
      clearTimeout(this.cooldownTimeout);
    }
  }

  public checkDestinationAndNavigate(): void {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/profile']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.onScrollRequest();
  }

  /**
   * Primary handler for window scroll events.
   * Prevents re-entry if a state change is already in progress due to cooldown.
   */
  private onScrollRequest(): void {
    if (this.isChangingState) {
      return;
    } else {
      this.handleChangeState()
    }
  }

  /**
   * Determines and applies header state changes (shrunk/original) based on the current scroll position.
   * Also manages the emission of the scroll-to-top request with a slight delay for smoother UX.
   */
  private handleChangeState(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const currentHasScrolled = this.hasScrolled();

    // Logic to determine if a state change is needed
    if (!currentHasScrolled && scrollPosition > this.SCROLL_THRESHOLD_SHRINK) {
      this.hasScrolled.set(true);
      this.activateCooldown()
    } else if (currentHasScrolled && scrollPosition <= this.SCROLL_THRESHOLD_RESTORE) {
      this.hasScrolled.set(false);
      this.activateCooldown()
      this.emitScrollToTopRequest()
    }
  }

  /**
   * Activates a cooldown period to prevent excessive state changes during rapid scrolling.
   */
  private activateCooldown(): void {
    this.isChangingState = true;
    this.cooldownTimeout = setTimeout(() => {
      this.isChangingState = false;
      this.cooldownTimeout = undefined;
    }, this.COOLDOWN_TIME);
  }

  /**
   * Emits the scroll-to-top request after a delay to allow header animation to start.
   *
   * Delay rationale {@link SCROLL_TO_TOP_EMIT_DELAY_MS}
   */
  private emitScrollToTopRequest() : void {
    setTimeout(() => {
      this.scrollService.requestScrollToTop();
    }, this.SCROLL_TO_TOP_EMIT_DELAY_MS);
  }
}
