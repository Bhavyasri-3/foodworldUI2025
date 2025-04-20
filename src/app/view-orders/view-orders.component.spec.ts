import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrdersComponent } from './view-orders.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { of } from 'rxjs';

describe('ViewOrdersComponent', () => {
  let component: ViewOrdersComponent;
  let fixture: ComponentFixture<ViewOrdersComponent>;

  const mockActivatedRoute = {
        queryParams:of({ orderId: '123'})
    }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOrdersComponent ],
      imports:[ 
        HttpClientTestingModule,
        MatSnackBarModule,
        MatToolbarModule
      ],
      providers: [
        { provide: ActivatedRoute , useValue: mockActivatedRoute}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
