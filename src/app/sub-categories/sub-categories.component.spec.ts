import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoriesComponent } from './sub-categories.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { CartService } from '../services/cart.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeService } from '../services/home.service';
import { MatBadgeModule } from '@angular/material/badge';


const mockActivatedRoute = {
  paramMap: of(convertToParamMap({ category: 'TestCategory'})),
  snapshot:{
    params:{},
    queryParams:{}
  }
}
class MockHomeService {
  getSubCategoryItems = jasmine.createSpy().and.returnValue(of([]));
  username$ = of('TestUser');
  isAdmin$ = of(true);
}
class MockCartService  {
  cartItems$= of([]);
  totalItems$ = of(0);
  updateItemQuantity = jasmine.createSpy('updateItemQuantity');
  removeItem = jasmine.createSpy('removeItem')
};

describe('SubCategoriesComponent', () => {
  let component: SubCategoriesComponent;
  let fixture: ComponentFixture<SubCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCategoriesComponent,
        NavbarComponent

       ],
      imports:[
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        MatBadgeModule
      ],
      providers:[
        { provide:ActivatedRoute, useValue: mockActivatedRoute },
        { provide : CartService, useClass : MockCartService },
        { provide : HomeService, useClass: MockHomeService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
