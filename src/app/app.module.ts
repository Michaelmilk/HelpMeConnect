import { BrowserModule, BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
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
import { CacheModule, CacheLoader, CacheStaticLoader, CACHE } from '@ngx-cache/core';
import { BrowserCacheModule, MemoryCacheService, LocalStorageCacheService } from '@ngx-cache/platform-browser';

export function cacheFactory(): CacheLoader {
    return new CacheStaticLoader({
        key: 'NGX_CACHE',
        lifeSpan: {
            "expiry": 86400000,//one day's miliseconds
            "TTL": 86400000
        }
    });
}

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
        // CacheModule.forRoot({
        //     provide: CacheLoader,
        //     useFactory: (cacheFactory)
        // }),
        CacheModule.forRoot(),
        BrowserCacheModule.forRoot([
            {
                provide: CACHE,
                useClass:  LocalStorageCacheService// or, MemoryCacheService
            }
        ]),
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
        MsGraphService,
        TransferState
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
