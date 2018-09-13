import { Component, OnInit } from '@angular/core';
import { AuthUser, UserProfile } from '../../core/authUser';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { Constants } from '../../core/constants';
import { GraphLink, GraphNode, LinkedGraph } from '../../core/graph/linkedGraph';
import { BaseComponent } from '../base/base.component';
import { Logger } from '../../helper/logger';
import { MsGraphService } from '../base/msGraphService';
import { finalize, switchMap } from '../../../../node_modules/rxjs/operators';
import { MsalService } from '../../helper/msal/msal.service';
import { interval } from '../../../../node_modules/rxjs';
import { SearchService } from './search.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent extends BaseComponent implements OnInit {
    query: string;
    preQuery: string;
    isSearching: boolean;
    isBack: boolean;
    isNotFound: boolean;
    isEntityCard: boolean;
    entityCards: Array<UserProfile>;

    notFoundTip: string = Constants.notFoundTip;

    constructor(
        public logger: Logger,
        public msalService: MsalService,
        public msGraphService: MsGraphService,
        private searchService: SearchService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super(logger);
    }

    ngOnInit() {
        this.query = this.route.snapshot.queryParamMap.get("query");
        this.preQuery = this.query;
        this.entityCards = Constants.entityCards;
        this.logger.info("entityCards",this.entityCards);
        if (this.entityCards.length == 0) {
            this.entityCards = new Array<UserProfile>();
            this.getUserInfos().add( () => {
                this.searchKeyWords(this.query);
            })
        }
        else{
            this.getUserInfos();
        }
  
    }

    searchKeyWords(query: string) {
        if (this.isSearching) {
            return;
        }
        this.isBack = false;
        this.isSearching = true;
        this.isNotFound = false;
        this.isEntityCard = true;
        this.notFoundTip = Constants.notFoundTip;
        this.preQuery = query;
        this.router.navigate(["/search"], {
            queryParams: {
                "query": this.query.trim()
            }
        });

        this.entityCards = new Array<UserProfile>();
        this.searchService.getConnectedEntity(query, this.user.email).subscribe((entities: any) => {
            let entityCount = entities.length;
            if (entityCount == 0) {
                this.isNotFound = true;
                this.notFoundTip = `can't get any related entities about {${query}}`;
                this.isSearching = false;
                return;
            }
            let count = 0;
            entities.forEach(t => {
                this.entityCards.push(new UserProfile(t.email, t.label, t.rank));
            });
            this.entityCards.forEach(t => {
                this.msGraphService.getUserProfile(t.email).subscribe((userProfile: any) => {
                    let phone = "";
                    if (userProfile.businessPhones.length > 0) {
                        phone = userProfile.businessPhones[0];
                    }
                    t.jobTitle = userProfile.jobTitle;
                    t.location = userProfile.officeLocation;
                    t.name = userProfile.displayName;
                    t.phone = phone;
                    if (!t.photo) {
                        t.photo = Constants.defaultImage;
                    }
                },
                (error) => {
                    this.isNotFound = true;
                    this.notFoundTip = `can't fetch the profile of ${t.email}`;
                    this.logger.error(`${this.notFoundTip} error: `, error);
                })
            });

            this.entityCards.forEach(t => {
                    this.msGraphService.getPhotoByUpn(t.email)
                    .pipe(
                        finalize(() => {
                            if (++count == entityCount) {
                                this.isSearching = false;
                            }
                            this.entityCards.sort((a,b) => a.rank - b.rank);
                        }
                    ))
                    .subscribe((photoBlob) => {
                        this.createImageFromBlob(photoBlob, t);
                    },
                    (error) => {
                        //this.isNotFound = true;
                        this.notFoundTip = `can't fetch the photo of ${t.name}`;
                        this.logger.error(`${this.notFoundTip} error: `, error);
                    })
                });
            }); 
            
            Constants.entityCards = this.entityCards;
    }

    getEmailLink(email: string) {
        //return `mailto:${email}?subject=""&amp;body=Message Content`
        return `mailto:${email}`
    }

    searchGraph(email: string){
        this.router.navigate(["/graph"], {
            queryParams: {
                "query": email.trim()
            }
        });
    }

}
