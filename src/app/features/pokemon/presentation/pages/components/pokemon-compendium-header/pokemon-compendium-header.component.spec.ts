import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonCompendiumHeaderComponent } from './pokemon-compendium-header.component';

describe('PokemonCompendiumHeader', () => {
  let component: PokemonCompendiumHeaderComponent;
  let fixture: ComponentFixture<PokemonCompendiumHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCompendiumHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonCompendiumHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
