import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { BaseComponent } from '../base/base.component';
import { Logger } from '../../helper/logger';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent extends BaseComponent implements OnInit {
    constructor(
        public logger: Logger,
        public router: Router
    ) {
        super(logger, router);
    }

    ngOnInit() {
    }

}
