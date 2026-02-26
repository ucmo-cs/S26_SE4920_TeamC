import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// App Components
import { AppComponent } from './app.component';
import { GenericErrorComponent } from './shared/components/generic-error/generic-error.component';
import { ProgressSpinnerComponent } from './shared/components/progress-spinner/progress-spinner.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { DailyStatusComponent } from './components/daily-status/daily-status.component';
import { UpdateDateRangeComponent } from './components/daily-status/update-date-range/update-date-range.component';
import { ReportReviewComponent } from './components/daily-status/report-review/report-review.component';
import { ReportDialogComponent } from './components/daily-status/report-dialog/report-dialog.component';
import { AdminComponent } from './components/admin/admin.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectsOverviewComponent } from './components/projects-overview/projects-overview.component';
import { TeamSummaryComponent } from './components/team-summary/team-summary.component';
import { TeamAdminComponent } from './components/team-admin/team-admin.component';

@NgModule({
    declarations: [
      AppComponent,
      GenericErrorComponent,
      ProgressSpinnerComponent,
      AppFooterComponent
      AppHeaderComponent,
      AppFooterComponent,
      HomeComponent,
      SidenavComponent,
      LoginComponent,
      AppComponent,
      ProgressSpinnerComponent,
      GenericErrorComponent,
      DailyStatusComponent,
      UpdateDateRangeComponent,
      ReportReviewComponent,
      ReportDialogComponent,
      AdminComponent,
      ProjectsComponent,
      ProjectsOverviewComponent,
      TeamSummaryComponent,
      TeamAdminComponent
    ],
    exports: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        LayoutModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        CommonModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
        MatCardModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatListModule,
        MatStepperModule,
        MatTabsModule,
        MatTreeModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatBadgeModule,
        MatChipsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatRippleModule,
        MatBottomSheetModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule,
        MatCardModule,
        MatProgressSpinnerModule
    ],
    providers: [
        MatSnackBar,
        provideHttpClient(withInterceptorsFromDi()),
        provideNativeDateAdapter(),
    ]
  })
  export class AppModule {}
