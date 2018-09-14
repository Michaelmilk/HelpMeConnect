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
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './component/notFound/pageNotFound.Component';
import { CommonModule } from '../../node_modules/@angular/common';
import { FormsModule } from '../../node_modules/@angular/forms';


@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        MsalModule.forRoot(environment.msalConfig),
        PipeModule,
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
