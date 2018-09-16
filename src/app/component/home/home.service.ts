import { Injectable } from '@angular/core';
import {
	HttpClient,
	HttpParams,
	HttpHeaders} from '@angular/common/http';


import { Logger } from '../../helper/logger';
import { environment } from '../../../environments/environment';

@Injectable()
export class HomeService {
	serverBaseUrl: string = environment.serverBaseUrl;
    msGraphUrl: string = environment.msGraphBaseUrl;

    constructor(
        public logger: Logger, 
        public httpClient: HttpClient
    ) {
    }
}