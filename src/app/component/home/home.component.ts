import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Logger } from '../../helper/logger';
import * as shape from 'd3-shape';
import { LinkedGraph, GraphNode, GraphLink } from '../../core/graph/linkedGraph';
import { HomeService } from './home.service';
import { MsGraphService } from '../base/msGraphService';
import { AuthUser, UserProfile } from '../../core/authUser';
import { MsalService } from '../../helper/msal/msal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {

    query: string;
    strengthList: any[];
    isShowPane: boolean = false;

    hierarchialGraph: LinkedGraph;
    links: Array<any>;
    nodes: Array<any>;
    view: Array<any>;
    width: number;
    height: number = 560;
    enableZoom: boolean = true;
    autoZoom: boolean = true;
    autoCenter: boolean = true;
    panOnZoom: boolean = true;
    panOffsetX: number = 100;
    panOffsetY: number = 10;
    zoom: number = 0.7;
    showLengend: boolean = true;
    colorScheme: any;
    orientation: string = "LR";
    curve: any = shape.curveLinear;
    selectedNode: any;
    selectedNodeTestLabel: string;

    isGraphReady: boolean;
    user: AuthUser;

    constructor(
        public logger: Logger,
        private msalService: MsalService,
        private msGraphService: MsGraphService,
        private homeService: HomeService
    ) {
        super(logger);
    }

    ngOnInit() {
        this.msalService.getUser().then((user: any) => {
            this.logger.info("user", user);
            this.user = new AuthUser(user.name, user.displayableId);
        });

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

        this.view = [this.width, this.height];

        this.colorScheme = {
            name: 'picnic',
            selectable: false,
            group: 'Ordinal',
            domain: [
                '#FAC51D', '#66BD6D', '#FAA026', '#29BB9C', '#E96B56', '#55ACD2', '#B7332F', '#2C83C9', '#9166B8', '#92E7E8'
            ]
        };

        this.links = new Array<any>();
        this.nodes = new Array<any>();
    }

    assignAllNodePhoto(nodes: Array<GraphNode>) {
        if (this.user.email) {
            nodes.forEach(t => {
                if (t.label.endsWith(".onmicrosoft.com")) {
                    this.msGraphService.getPhotoByUpn(t.label).subscribe((result) => {
                        this.createImageFromBlob(result, t);
                        this.logger.info("photo", t);
                    })
                }
            })
        }
    }

    select(node: any) {
        if (this.isShowPane && this.selectedNodeTestLabel == node.label) {
            this.isShowPane = false;
            node.isChecked = false;
        }
        else {
            this.isShowPane = true;
            node.isChecked = true;

        }

        this.hierarchialGraph.nodes.forEach(t => {
            if (t.id == node.id) {
                t.isChecked = node.isChecked;
                $(<any>'.circle' + t.id).attr("style", "");
            }
            else {
                t.isChecked = false;
                $(<any>'.circle' + t.id).css("filter", "none");
            }
        });
        this.selectedNodeTestLabel = node.label;
        if (!node.profile) {
            this.msGraphService.getUserProfile(node.label).subscribe((userProfile: any) => {
                this.logger.info("userProfile", userProfile);
                node.profile = new UserProfile(userProfile.displayName, userProfile.mail, userProfile.jobTitle, userProfile.mobilePhone, userProfile.officeLocation);
                this.selectedNode = node.profile;
            })
        }
        
    }

    searchGraph(query: string) {
        this.isGraphReady = false;
        this.links = [];
        this.nodes = [];
        this.logger.info(query);
        this.homeService.getGraphLink(query, this.user.email).subscribe((result: Array<GraphLink>) => {
            this.logger.info("graph link", result);
            this.generateGraphLink(result);
            this.generateGraphNode(result)
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

        let firstNode;
        let lastNode;
        idToUpn.forEach((value, key, map) => {
            let img = "./assets/images/user.png";
            if (value.indexOf("@m365x342201.onmicrosoft.com") != -1) {
                img = `https://euclidepic.blob.core.windows.net/pic/${value.replace("@m365x342201.onmicrosoft.com", "")}.jpg`;
            }
            this.logger.info("value", value);

            this.nodes.push(new GraphNode(key, img, value));
        });

        this.logger.info("nodes", this.nodes);
        this.nodes.forEach(t => t.isChecked = false);
        this.assignAllNodePhoto(this.nodes);
        this.hierarchialGraph = { links: this.links, nodes: this.nodes };
        this.isGraphReady = true;

        this.logger.info("links, nodes", this.links, this.nodes);
    }

}
