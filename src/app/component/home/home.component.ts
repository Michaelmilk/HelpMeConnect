import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Logger } from '../../helper/logger';
import * as shape from 'd3-shape';
import { LinkedGraph, GraphNode, GraphLink } from '../../core/graph/linkedGraph';
import { HomeService } from './home.service';
import { MsGraphService } from '../base/msGraphService';
import { AuthUser, UserProfile } from '../../core/authUser';
import { MsalService } from '../../helper/msal/msal.service';
import { User } from '../../../../node_modules/msal';
import { finalize, switchMap } from '../../../../node_modules/rxjs/operators';
import { Constants } from '../../core/constants';
import { interval } from '../../../../node_modules/rxjs';
import { Router } from '../../../../node_modules/@angular/router';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {

    isSearching: boolean;
    isNotFound: boolean;
    query: string;

    constructor(
        public logger: Logger,
        public msalService: MsalService,
        public msGraphService: MsGraphService,
        private router: Router
    ) {
        super(logger);
    }

    ngOnInit() {
        this.getUserInfos();
    }
    
    search(query: string) {
        if(this.isSearching){
            return;
        }
        this.isSearching = true;
        this.isNotFound = false;
        this.notFoundTip = Constants.notFoundTip;
        if (query.indexOf("@") != -1) {
            this.router.navigate(["/graph"], {
                queryParams: {
                    "query": this.query.trim()
                }
            });
        } else {
            this.router.navigate(["/search"], {
                queryParams: {
                    "query": this.query.trim()
                }
            });
        }

    }

}
