import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Logger } from '../../helper/logger';
import { MsGraphService } from '../base/msGraphService';
import { MsalService } from '../../helper/msal/msal.service';
import { Router } from '../../../../node_modules/@angular/router';
import { CacheService } from '@ngx-cache/core';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {
    constructor(
        public logger: Logger,
        public router: Router,
        public msalService: MsalService,
        public msGraphService: MsGraphService,
        public cacheService: CacheService
    ) {
        super(logger, router, msalService, msGraphService, cacheService);
    }

    ngOnInit() {
        this.getUserInfos();
    }

}
