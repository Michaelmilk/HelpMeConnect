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
        private router: Router,
        public msalService: MsalService,
        public msGraphService: MsGraphService
    ) {
        super(logger);
        
        this.msalService.authenticated.then((isAuthenticated: boolean) => {
            this.logger.info("isauth", isAuthenticated);
            if (!isAuthenticated) {
                this.msalService.login();
            }
        })
    }

    ngOnInit() {
    
    }

    logout() {
        this.msalService.logout();
    }

    testGraphApi() {
        this.msalService.authenticated.then((isAuthenticated: boolean) => {
            this.logger.info("isauth", isAuthenticated);
        })

        if (this.user.email) {
            this.user = new AuthUser(this.user.name, this.user.email);
            this.msGraphService.getPhotoByUpn(this.user.email).subscribe((photoBlob) => {
                this.createImageFromBlob(photoBlob, this.user);
            })

            this.msGraphService.getUserProfile("danipi@M365x342201.onmicrosoft.com").subscribe((userProfile) => {
                this.logger.info("profile", userProfile);
            })
        }
    }
}
