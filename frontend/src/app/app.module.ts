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

@NgModule({
  declarations: [
    AppComponent,
    GenericErrorComponent,
    ProgressSpinnerComponent,
    AppFooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }