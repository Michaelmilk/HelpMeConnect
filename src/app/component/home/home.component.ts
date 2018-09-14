import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Logger } from '../../helper/logger';
import { MsGraphService } from '../base/msGraphService';
import { MsalService } from '../../helper/msal/msal.service';
import { Router } from '../../../../node_modules/@angular/router';


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
        public msGraphService: MsGraphService
    ) {
        super(logger, router);
    }

    ngOnInit() {
        this.getUserInfos();
    }

}
