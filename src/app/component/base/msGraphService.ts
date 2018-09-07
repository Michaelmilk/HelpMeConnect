import { Component, OnInit, Injectable } from '@angular/core';
import {
    HttpClient,
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpParams,
    HttpHeaders,
    HttpResponse
} from '@angular/common/http';


import { Logger } from '../../helper/logger';
import { environment } from '../../../environments/environment';
import { MsalService } from '../../helper/msal/msal.service';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';

@Injectable()
export class MsGraphService {
    serverUrl: string = environment.serverBaseUrl;
    msGraphUrl = environment.msGraphBaseUrl;
    headers = new HttpHeaders({ "Content-Type": "application/json" });

    constructor(
        public logger: Logger,
        public httpClient: HttpClient
    ) {
    }

    public getPhotoByUpn(upn: string) {
        return this.httpClient.get(`${this.msGraphUrl}/users/${upn}/photo/$value`,
            {
                headers: new HttpHeaders().append('Content-Type', 'image/jpg'),
                responseType: 'blob'
            });
            //.pipe(
            //     catchError(err => {
            //         if (err.status == 403) {
            //             this.logger.info("error catch 403:", err);
            //             return EMPTY;
            //         } else if (err.status == 404) {
            //             this.logger.info("error catch: 404", err);
            //             return EMPTY;
            //         } else {
            //             return throwError(err);
            //         }
            //     })
            // );
    }

    public getUserProfile(upn: string) {
        return this.httpClient.get(`${this.msGraphUrl}/users/${upn}`, { headers: this.headers });
    }

    public getMyProfile() {
        return this.httpClient.get(`${this.msGraphUrl}/me`, { headers: this.headers });
    }
}