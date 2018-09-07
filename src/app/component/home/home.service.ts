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

@Injectable()
export class HomeService {
	serverBaseUrl: string = environment.serverBaseUrl;
    msGraphUrl: string = environment.msGraphBaseUrl;
    private headers = new HttpHeaders({ "Content-Type": "application/json" });

    constructor(
        public logger: Logger, 
        public httpClient: HttpClient
    ) {
    }
    
    public getGraphLink(query: string, user: string) {
		const httpParams = new HttpParams()
			.set("search_email", query)
			.set("user_email", user);
		return this.httpClient.get(
			`${this.serverBaseUrl}/connection`,
			{ params: httpParams }
		);
    }
    
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