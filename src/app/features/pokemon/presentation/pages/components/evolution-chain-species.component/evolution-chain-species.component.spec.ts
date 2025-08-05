import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutionChainSpeciesComponent } from './evolution-chain-species.component';

describe('EvolutionChainSpeciesComponent', () => {
  let component: EvolutionChainSpeciesComponent;
  let fixture: ComponentFixture<EvolutionChainSpeciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvolutionChainSpeciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvolutionChainSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
