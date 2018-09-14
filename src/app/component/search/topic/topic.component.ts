import { Component, OnInit } from '@angular/core';
import { AuthUser, UserProfile } from '../../../core/authUser';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { Constants } from '../../../core/constants';
import { GraphLink, GraphNode, LinkedGraph } from '../../../core/graph/linkedGraph';
import { BaseComponent } from '../../base/base.component';
import { Logger } from '../../../helper/logger';
import { MsGraphService } from '../../base/msGraphService';
import { finalize, switchMap } from '../../../../../node_modules/rxjs/operators';
import { MsalService } from '../../../helper/msal/msal.service';
import { TopicService } from './topic.service';

@Component({
    selector: 'app-topic',
    templateUrl: './topic.component.html',
    styleUrls: ['./topic.component.css']
})
export class TopicComponent extends BaseComponent implements OnInit {
    preQuery: string;
    isSearching: boolean;
    isNotFound: boolean;
    entityCards: Array<UserProfile>;

    notFoundTip: string = Constants.notFoundTip;

    constructor(
        public logger: Logger,
        public router: Router,
        public msalService: MsalService,
        public msGraphService: MsGraphService,
        private topicService: TopicService,
        private route: ActivatedRoute
    ) {
        super(logger, router);
    }

    ngOnInit() {
        this.query = this.route.snapshot.queryParamMap.get("query");
        this.preQuery = this.query;

        if (!this.entityCards) {
            this.entityCards = new Array<UserProfile>();
            this.getUserInfos().add(() => {
                this.searchKeyWords(this.query);
            })
        }
    }

    searchKeyWords(query: string) {
        if (this.isSearching) {
            return;
        }
        this.search(query);
        this.isSearching = true;
        this.isNotFound = false;
        this.notFoundTip = Constants.notFoundTip;
        this.preQuery = query;

        this.entityCards = new Array<UserProfile>();
        this.topicService.getConnectedEntity(query, this.user.email).subscribe((entities: any) => {
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
                            this.entityCards.sort((a, b) => a.rank - b.rank);
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
    }

    getEmailLink(email: string) {
        //return `mailto:${email}?subject=""&amp;body=Message Content`
        return `mailto:${email}`
    }

}
