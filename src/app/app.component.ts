import { Component, OnInit } from '@angular/core';

import { BaseComponent } from './component/base/base.component';
import { Logger } from './helper/logger';
import { BaseService } from './component/base/base.service';
import { MsalService } from './helper/msal/msal.service';
import { MsGraphService } from './component/base/msGraphService';
import { AuthUser } from './core/authUser';
import { interval, observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '../../node_modules/@angular/router';
import { PlatformLocation } from '../../node_modules/@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseComponent implements OnInit {
    user: AuthUser;
    timeInterval: any;

    constructor(
        protected logger: Logger,
        public router: Router,
        public msalService: MsalService,
        public msGraphService: MsGraphService
        
    ) {
        super(logger, router);

        this.msalService.authenticated.then((isAuthenticated: boolean) => {
            this.logger.info("isauth", isAuthenticated);
            if (!isAuthenticated) {
                this.msalService.login();
            }
        })

    }

    ngOnInit() {
 
    }

}
