import { TestBed } from '@angular/core/testing';
import { Cesta } from './cesta';

describe('Cesta', () => {
  let service: Cesta;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cesta);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
