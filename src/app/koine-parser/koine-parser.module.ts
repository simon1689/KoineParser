import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BibleRangeComponent} from '../bible-range/bible-range.component';
import {WordsComponent} from '../words/words.component';
import {ParseComponent} from '../parse/parse.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule, routes} from '../app-routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {MatSliderModule} from '@angular/material/slider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {NgxUiLoaderModule} from 'ngx-ui-loader';
import {StateService} from '../state.service';


@NgModule({
  declarations: [
    BibleRangeComponent,
    ParseComponent,
    WordsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgxUiLoaderModule,
  ],
  exports: [
    BibleRangeComponent,
    ParseComponent,
  ],
  providers: [
    StateService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class KoineParserModule {
}
