import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { PrivacySidebarComponent } from './privacy-sidebar/privacy-sidebar.component';
import { ContentService } from './privacy-sidebar/content.service';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    HttpClientModule,
    SidebarModule
  ],
  declarations: [PrivacySidebarComponent],
  exports: [CommonModule, PrivacySidebarComponent],
  providers: [ContentService]
})
export class PrivacySidebarModule {
}
