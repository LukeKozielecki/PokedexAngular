import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonDetailsHeader } from './details-header.component';

describe('DetailHeader', () => {
  let component: PokemonDetailsHeader;
  let fixture: ComponentFixture<PokemonDetailsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonDetailsHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonDetailsHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
