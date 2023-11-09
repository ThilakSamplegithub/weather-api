import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// import { AppModule } from './app/app.module';
bootstrapApplication(AppComponent).catch((e) => console.error(e));
