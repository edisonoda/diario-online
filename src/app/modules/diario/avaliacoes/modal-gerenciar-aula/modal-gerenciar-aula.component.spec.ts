import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGerenciarAulaComponent } from './modal-gerenciar-aula.component';

describe('ModalGerenciarAulaComponent', () => {
  let component: ModalGerenciarAulaComponent;
  let fixture: ComponentFixture<ModalGerenciarAulaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalGerenciarAulaComponent]
    });
    fixture = TestBed.createComponent(ModalGerenciarAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
