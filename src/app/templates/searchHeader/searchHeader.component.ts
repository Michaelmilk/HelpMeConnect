import { Component, OnInit, Output, EventEmitter } from "../../../../node_modules/@angular/core";
import { BaseComponent } from "../../component/base/base.component";
import { Logger } from '../../helper/logger';
import { MsalService } from "../../helper/msal/msal.service";
import { MsGraphService } from "../../component/base/msGraphService";
import { ActivatedRoute, Router } from "../../../../node_modules/@angular/router";
import { PlatformLocation } from "../../../../node_modules/@angular/common";

@Component({
    selector: 'search-header',
    templateUrl: './searchHeader.component.html',
    styleUrls: ['./searchHeader.component.css']
})

export class SearchHeaderComponent extends BaseComponent implements OnInit {

    @Output() emitSearch = new EventEmitter<string>();

    constructor(
        public logger: Logger,
        public router: Router,
        public msalService: MsalService,
        public msGraphService: MsGraphService,
        private route: ActivatedRoute,
        public location: PlatformLocation
    ) {
        super(logger, router);

        //https://angular.io/api/common/PlatformLocation
        //https://stackoverflow.com/questions/40381814/how-do-i-detect-user-navigating-back-in-angular2
        this.location.onPopState(()=>{
            this.query = this.location.search.split("=")[1];
            this.emitSearchToRoot(this.query)
        });
    }

    ngOnInit() {
        this.query = this.route.snapshot.queryParamMap.get("query");
        this.getUserInfos();
    }

    emitSearchToRoot(query: string) {
        this.emitSearch.emit(query);
    }

}