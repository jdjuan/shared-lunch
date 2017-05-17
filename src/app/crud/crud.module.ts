import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudComponent } from './crud/crud.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { MatToIterablePipe } from './dropdown/mat-to-iterable.pipe';
import { FiltersComponent } from './filters/filters.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule
  ],
  declarations: [CrudComponent, DropdownComponent, MatToIterablePipe, FiltersComponent],
  exports: [CrudComponent]
})
export class CrudModule { }
