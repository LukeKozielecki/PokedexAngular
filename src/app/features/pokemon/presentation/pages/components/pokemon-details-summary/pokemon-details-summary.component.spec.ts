import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonDetailsSummaryComponent } from './pokemon-details-summary.component';

describe('PokemonDetailsSummary', () => {
  let component: PokemonDetailsSummaryComponent;
  let fixture: ComponentFixture<PokemonDetailsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonDetailsSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonDetailsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
