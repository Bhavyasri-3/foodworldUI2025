import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddSubCategoriesComponent } from './add-sub-categories.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatOptionModule } from '@angular/material/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatSelectModule } from '@angular/material/select';

const mockActivatedRoute = {
  snapshot:{
    params:{},
    queryParams:{}
  }
}

describe('AddSubCategoriesComponent', () => {
  let component: AddSubCategoriesComponent;
  let fixture: ComponentFixture<AddSubCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSubCategoriesComponent ,
        SpinnerComponent
      ],
      imports:[
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatOptionModule,
        MatSelectModule
      ],
      providers:[
        { provide: MatDialogRef, useValue: {close:jasmine.createSpy('close')}},
        { provide: MAT_DIALOG_DATA, useValue: { categoryTitle:'Test Category'}},
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        MatSnackBar
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
