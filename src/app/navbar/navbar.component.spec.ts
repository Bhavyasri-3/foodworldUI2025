import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { of } from 'rxjs';
import { HomeService } from '../services/home.service';
import { CartService } from '../services/cart.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  class MockHomeService{
    username$ = of('TestUser');
    isAdmin$ = of(true);
  }

  class MockCartService{
    totalItems$ = of(5);
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[ MatDialogModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatIconModule,
        MatBadgeModule
      ],
      declarations: [ NavbarComponent ],
      providers:[
        { provide: HomeService, useClass: MockHomeService},
        { provide: CartService, useClass: MockCartService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
