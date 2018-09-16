import { Component, OnInit } from '@angular/core';
import { UserProfile, AuthUser } from '../../../core/authUser';
import * as shape from 'd3-shape';
import { Logger } from '../../../helper/logger';
import { BaseComponent } from '../../base/base.component';
import { GraphService } from './graph.service';
import { switchMap, finalize } from '../../../../../node_modules/rxjs/operators';
import { MsalService } from '../../../helper/msal/msal.service';
import { MsGraphService } from '../../base/msGraphService';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { Constants } from '../../../core/constants';
import { GraphLink, GraphNode, LinkedGraph } from '../../../core/graph/linkedGraph';
import { CacheService } from '@ngx-cache/core';

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.css']
})
export class GraphComponent extends BaseComponent implements OnInit {
    isLoadingProfile: boolean;
    isShowPane: boolean;
    isNotFound: boolean;
    isSearching: boolean;
    isShowStrengthList: boolean;
    notFoundTip: string = Constants.notFoundTip;

    linkedGraph: LinkedGraph;
    strengthList: any[];

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

    constructor(
        public logger: Logger,
        public router: Router,
        private graphService: GraphService,
        public msalService: MsalService,
        public msGraphService: MsGraphService,
        public cacheService: CacheService,
        private route: ActivatedRoute
    ) {
        super(logger, router)
    }

    ngOnInit() {

        this.query = this.route.snapshot.queryParamMap.get("query");
        this.isShowStrengthList = false;

        this.selectedNodeProfile = new UserProfile();
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
        this.height = document.documentElement.clientHeight - 100;
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

        this.getUserInfos().add(() => {
            this.searchGraph(this.query);
        })
    }

    searchGraph(query: string) {
        if (this.isSearching) {
            return;
        }
        this.search(query);
        this.isSearching = true;
        this.isNotFound = false;
        this.notFoundTip = Constants.notFoundTip;

        this.links = [];
        this.nodes = [];

        this.graphService.getGraphLink(query, this.user.email).subscribe((links: Array<GraphLink>) => {
            if (links.length == 0) {
                this.isNotFound = true;
                this.isSearching = false;
                return;
            }
            this.logger.info("graph link", links);
            this.generateGraphLink(links);
            this.generateGraphNode(links)
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
            //this.logger.info("value", value);
            this.nodes.push(new GraphNode(key, Constants.defaultImage, value));
        });

        this.logger.info("nodes", this.nodes);
        this.nodes.forEach(t => t.isChecked = false);
        this.assignAllNodePhoto(this.nodes);
        this.linkedGraph = new LinkedGraph(this.links, this.nodes);
        this.logger.info("links, nodes", this.links, this.nodes);
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
                            this.isShowStrengthList = true;
                        }
                    })
                ).subscribe((result) => {
                    this.createImageFromBlob(result, t);
                    //this.logger.info("photo", t);
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
                node.profile = new UserProfile(userProfile.mail, "", 0, userProfile.displayName, userProfile.jobTitle, phone, userProfile.officeLocation);
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

    getEmailLink(email: string) {
        //return `mailto:${email}?subject=""&amp;body=Message Content`
        return `mailto:${email}`
    }

}
