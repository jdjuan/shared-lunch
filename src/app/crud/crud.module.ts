import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudComponent } from './crud/crud.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { MatToIterablePipe } from './dropdown/mat-to-iterable.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CrudComponent, DropdownComponent, MatToIterablePipe],
  exports: [CrudComponent]
})
export class CrudModule { }
