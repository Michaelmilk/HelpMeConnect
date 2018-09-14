import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { BaseComponent } from '../base/base.component';
import { Logger } from '../../helper/logger';
import { MsGraphService } from '../base/msGraphService';
import { MsalService } from '../../helper/msal/msal.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent extends BaseComponent implements OnInit {

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
