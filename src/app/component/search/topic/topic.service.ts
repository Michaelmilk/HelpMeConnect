import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpParams,
    HttpHeaders} from '@angular/common/http';


import { Logger } from '../../../helper/logger';
import { environment } from '../../../../environments/environment';

@Injectable()
export class TopicService {
    serverBaseUrl: string = environment.serverBaseUrl;
    msGraphUrl: string = environment.msGraphBaseUrl;

    constructor(
        public logger: Logger,
        public httpClient: HttpClient
    ) { }

    public getConnectedEntity(query: string, user: string) {
        const httpParams = new HttpParams()
            .set("topic", query)
            .set("user_email", user);
        return this.httpClient.get(
            `${this.serverBaseUrl}/Topic`,
            { params: httpParams }
        );
    }
}