import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { Logger } from './helper/logger';
import { Constants } from './core/constants';
import { MsalModule } from './helper/msal/msal.module';
import { MsalInterceptor } from './helper/msal/msal.interceptor';
import { MsGraphService } from './component/base/msGraphService';
import { PipeModule } from './pipe/pipe.module';
import { HomeComponent } from './component/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './component/notFound/pageNotFound.Component';
import { HomeModule } from './component/home/home.module';


@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        MsalModule.forRoot(environment.msalConfig),
        PipeModule,
        HomeModule,
        AppRoutingModule,
    ],
    providers: [
        Logger,
        { provide: 'loggerName', useValue: Constants.loggerName },
        { provide: 'loggerLevel', useValue: environment.logLevel },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true
        },
        MsGraphService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
