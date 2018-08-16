import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TsIconModule } from './../icon/icon.module';

import { TsChipComponent } from './chip.component';

export * from './chip.component';


@NgModule({
  imports: [
    CommonModule,
    TsIconModule,
  ],
  declarations: [
    TsChipComponent,
  ],
  exports: [
    TsChipComponent,
  ],
})
export class TsChipModule {}
