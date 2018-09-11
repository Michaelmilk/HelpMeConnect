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


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {
    query: string;
    keyWords: string;
    isBack: boolean = false;
    strengthList: any[];
    isShowPane: boolean;
    isLoadingProfile: boolean;

    linkedGraph: LinkedGraph;
    links: Array<any>;
    nodes: Array<any>;
    view: Array<any>;
    width: number;
    height: number;
    enableZoom: boolean = true;
    fitContainer: boolean = false;
    autoZoom: boolean = true;
    autoCenter: boolean = true;
    panOnZoom: boolean = true;
    panOffsetX: number;
    panOffsetY: number;
    zoom: number = 0.7;
    zoomLevel: number;
    showLengend: boolean = true;
    colorScheme: any;
    orientation: string = "LR";
    curve: any = shape.curveBundle.beta(1);
    selectedNodeProfile: UserProfile;

    isSearching: boolean;
    user: AuthUser;

    entityCards: Array<UserProfile>;
    isEntityCard: boolean;

    notFoundTip: string = Constants.notFoundTip;
    isNotFound: boolean;

    timeInterval: any;

    constructor(
        public logger: Logger,
        private msalService: MsalService,
        private msGraphService: MsGraphService,
        private homeService: HomeService
    ) {
        super(logger);
    }

    ngOnInit() {
        this.user = new AuthUser();
        this.timeInterval = interval(1000)
            .pipe(switchMap(() => this.msalService.getUser()))
            .subscribe((user: any) => {
                if (user.displayableId && !this.user.email) {
                    this.logger.info("user", user);
                    this.user = new AuthUser(user.name, user.displayableId);
                    this.logger.info("clear time interval", this.user.email);
                    this.timeInterval.unsubscribe();
                }
            });

        this.entityCards = new Array<UserProfile>();
        this.selectedNodeProfile = new UserProfile();
        this.isEntityCard = true;
        this.strengthList = [
            {
                strength: 'Strong',
                color: '#66BD6D'
            },
            {
                strength: 'Medium',
                color: '#0d76a5'
            },
            {
                strength: 'Weak',
                color: '#bee4f5'
            }
        ];

        this.width = 0.83 * $(<any>".container-fluid").width();
        this.height = document.documentElement.clientHeight - 340;
        this.view = [this.width, this.height];

        this.colorScheme = {
            name: 'picnic',
            selectable: false,
            group: 'Ordinal',
            domain: [
                '#FAC51D', '#66BD6D', '#FAA026', '#29BB9C', '#E96B56', '#55ACD2', '#B7332F', '#2C83C9', '#9166B8', '#92E7E8'
            ]
        };
        this.linkedGraph = new LinkedGraph();
        this.links = new Array<any>();
        this.nodes = new Array<any>();
    }

    assignAllNodePhoto(nodes: Array<GraphNode>) {
        let nodeCount = nodes.length;
        let count = 0;
        nodes.forEach(t => {
            if (t.label.endsWith(".onmicrosoft.com")) {
                this.msGraphService.getPhotoByUpn(t.label).pipe(
                    finalize(() => {
                        if (++count == nodeCount) {
                            this.isSearching = false;
                        }
                    })
                ).subscribe((result) => {
                    this.createImageFromBlob(result, t);
                    this.logger.info("photo", t);
                },
                    (error) => {
                        //this.isNotFound = true;
                        this.notFoundTip = `can't fetch the photo of ${t.label}`;
                        this.logger.error(`${this.notFoundTip} error: `, error);
                    })
            }
        })
    }

    select(node: any) {
        if (!node.label.toLowerCase().endsWith("onmicrosoft.com")) {
            return;
        }

        this.selectedNodeProfile = new UserProfile();
        if (this.isShowPane && this.selectedNodeProfile.email == node.label) {
            this.isShowPane = false;
            node.isChecked = false;
        } else {
            this.isShowPane = true;
            node.isChecked = true;
        }

        this.linkedGraph.nodes.forEach(t => {
            if (t.id == node.id) {
                t.isChecked = node.isChecked;
                $(<any>'.circle' + t.id).attr("style", "");
            } else {
                t.isChecked = false;
                $(<any>'.circle' + t.id).css("filter", "none");
            }
        });

        if (!node.profile) {
            this.isLoadingProfile = true;
            this.logger.info("isLoadingProfile", this.isLoadingProfile);
            this.msGraphService.getUserProfile(node.label).subscribe((userProfile: any) => {
                this.logger.info("userProfile", userProfile);
                let phone = "";
                if (userProfile.businessPhones.length > 0) {
                    phone = userProfile.businessPhones[0];
                }
                node.profile = new UserProfile(userProfile.displayName, userProfile.mail, userProfile.jobTitle, phone, userProfile.officeLocation);
                this.selectedNodeProfile = node.profile;
                this.isLoadingProfile = false;
            },
                (error) => {
                    //this.isNotFound = true;
                    this.notFoundTip = `can't fetch the profile of ${node.label}`;
                    this.logger.error(`${this.notFoundTip} error: `, error);
                    this.isLoadingProfile = false;
                })
        } else {
            this.selectedNodeProfile = node.profile;
        }
    }

    search(query: string) {
        if(this.isSearching){
            return;
        }
        this.isBack = false;
        this.isSearching = true;
        this.isNotFound = false;
        this.notFoundTip = Constants.notFoundTip;
        if (query.indexOf("@") != -1) {
            this.isEntityCard = false;
            this.searchGraph(query);
        } else {
            this.isEntityCard = true;
            this.keyWords = query;
            this.searchKeyWords(query);
        }
    }

    searchKeyWords(query: string) {
        this.entityCards = new Array<UserProfile>();
        this.homeService.getConnectedEntity(query, this.user.email).subscribe((entities: any) => {
            let entityCount = entities.length;
            if (entityCount == 0) {
                this.isNotFound = true;
                this.notFoundTip = `can't get any related entities about {${query}}`;
                this.isSearching = false;
            }
            let count = 0;
            entities.forEach(t => {
                this.msGraphService.getUserProfile(t.email).subscribe((userProfile: any) => {
                    let phone = "";
                    if (userProfile.businessPhones.length > 0) {
                        phone = userProfile.businessPhones[0];
                    }
                    let profile = new UserProfile(userProfile.displayName,
                        userProfile.userPrincipalName, userProfile.jobTitle,
                        phone, userProfile.officeLocation,
                        t.label, Constants.defaultImage, t.rank);
                    this.msGraphService.getPhotoByUpn(profile.email).pipe(
                        finalize(() => {
                            if (++count == entityCount) {
                                this.isSearching = false;
                            }
                            this.entityCards.push(profile);
                            this.entityCards.sort((a,b) => a.rank - b.rank)
                        })
                    ).subscribe((photoBlob) => {
                        this.createImageFromBlob(photoBlob, profile);
                    },
                        (error) => {
                            //this.isNotFound = true;
                            this.notFoundTip = `can't fetch the photo of ${userProfile.userPrincipalName}`;
                            this.logger.error(`${this.notFoundTip} error: `, error);
                        })
                },
                    (error) => {
                        this.isNotFound = true;
                        this.notFoundTip = `can't fetch the profile of ${t.email}`;
                        this.logger.error(`${this.notFoundTip} error: `, error);
                    })
            });
        })
    }

    //upn is entity's eamil in general
    switchToSearchGraph(upn: string) {
        this.isEntityCard = false;
        this.query = upn;
        this.search(upn);
        this.isBack = true;
    }

    switchToEntityCards(){
        this.isEntityCard = true;
        this.query = this.keyWords; 
    }

    searchGraph(query: string) {
        this.links = [];
        this.nodes = [];
        this.logger.info(query);
        this.homeService.getGraphLink(query, this.user.email).subscribe((links: Array<GraphLink>) => {
            if (links.length == 0) {
                this.isNotFound = true;
                this.isSearching = false;
            }
            this.logger.info("graph link", links);
            this.generateGraphLink(links);
            this.generateGraphNode(links)
            this.isSearching = false;
        },
            (error: any) => {
                //this.isNotFound = true;
                this.notFoundTip = `can't get the graph from ${this.user.email} to ${query}`;
                this.logger.error(`${this.notFoundTip}, error: `, error);
            });
    }

    generateGraphLink(links: Array<GraphLink>) {
        links.forEach(t => {
            if (t.source_upn == this.query) {
                t.source = "start";
            }

            if (t.target_upn == this.user.email.toString().toLowerCase()) {
                t.target = "end";
            }

            this.links.push(t);
        })

        this.links.forEach(t => {
            switch (t.label) {
                case "Strong":
                    t.color = '#66BD6D';
                    break;
                case "Medium":
                    t.color = '#0d76a5'
                    break;
                case "Weak":
                    t.color = '#bee4f5'
                    break;
            }
        });
    }


    generateGraphNode(links: Array<GraphLink>) {
        let idToUpn = new Map<string, string>();
        links.forEach(t => {
            idToUpn.set(t.source, t.source_upn);
            idToUpn.set(t.target, t.target_upn);
        });

        this.logger.info("idtoupn", idToUpn);

        idToUpn.forEach((value, key, map) => {
            //let img = "./assets/images/user.png";
            // if (value.endsWith("@m365x342201.onmicrosoft.com")) {
            //     img = `https://euclidepic.blob.core.windows.net/pic/${value.replace("@m365x342201.onmicrosoft.com", "")}.jpg`;
            // }
            this.logger.info("value", value);

            this.nodes.push(new GraphNode(key, Constants.defaultImage, value));
        });

        this.logger.info("nodes", this.nodes);
        this.nodes.forEach(t => t.isChecked = false);
        this.assignAllNodePhoto(this.nodes);
        this.linkedGraph = new LinkedGraph(this.links, this.nodes);
        this.logger.info("links, nodes", this.links, this.nodes);
    }

    getEmailLink(email: string) {
        //return `mailto:${email}?subject=""&amp;body=Message Content`
        return `mailto:${email}`
    }
}
