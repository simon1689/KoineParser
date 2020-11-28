import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BibleRangeComponent} from '../bible-range/bible-range.component';
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
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatExpansionModule} from '@angular/material/expansion';
import {ParseAnswerDialogComponent} from '../parse-answer-dialog/parse-answer-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatDividerModule} from '@angular/material/divider';
import {ReportErrorOnPageDialogComponent} from '../report-error-on-page/report-error-on-page-dialog.component';
import {AboutComponent} from '../about/about.component';
import {NavbarComponent} from '../navigation/navbar/navbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ContactComponent} from '../contact/contact.component';
import {ExtendedModule, FlexModule} from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import {SideNavComponent} from '../navigation/side-nav/side-nav.component';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SessionsComponent} from '../sessions/sessions.component';
import {MyScoresComponent} from '../my-scores/my-scores.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {GreekStylerPipe} from '../greek-styler.pipe';
import {ResourcesComponent} from '../resources/resources.component';
import {ParadigmsComponent} from '../paradigms/paradigms.component';

@NgModule({
  declarations: [
    BibleRangeComponent,
    ParseComponent,
    ParseAnswerDialogComponent,
    ReportErrorOnPageDialogComponent,
    AboutComponent,
    NavbarComponent,
    ContactComponent,
    SideNavComponent,
    SessionsComponent,
    MyScoresComponent,
    GreekStylerPipe,
    ResourcesComponent,
    ParadigmsComponent,
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
    MatButtonModule,
    NgxUiLoaderModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatStepperModule,
    MatExpansionModule,
    MatDialogModule,
    DragDropModule,
    MatDividerModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatTooltipModule,
    FlexModule,
    ExtendedModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatTabsModule,
    MatSidenavModule,
    MatTableModule,
    MatSortModule,
  ],
  exports: [
    BibleRangeComponent,
    ParseComponent,
    NavbarComponent,
    MatTabsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    SideNavComponent,
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
