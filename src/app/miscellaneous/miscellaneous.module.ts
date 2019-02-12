import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { UtilsModule } from '../utils/utils.module';

import {
  MatButtonModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatSlideToggleModule,
  MatTabsModule,
} from '@angular/material';

import { SettingsDialog } from './dialogs/settings-dialog/settings-dialog.component';
import { AgreementDialog } from './dialogs/agreement-dialog/agreement-dialog.component';

@NgModule({
  declarations: [
    SettingsDialog,
    AgreementDialog
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    UtilsModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTabsModule
  ],
  exports: [
    SettingsDialog
  ],
  entryComponents: [
    SettingsDialog,
    AgreementDialog
  ]
})
export class MiscellaneousModule { }
