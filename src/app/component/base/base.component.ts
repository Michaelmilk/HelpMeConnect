import { Logger } from '../../helper/logger';
import * as $ from 'jquery';
import { Connection } from '../../core/graph/linkedGraph';
import { AuthUser } from '../../core/authUser';
import { interval, observable, Observable, empty } from '../../../../node_modules/rxjs';
import { switchMap } from '../../../../node_modules/rxjs/operators';
import { MsalService } from '../../helper/msal/msal.service';
import { MsGraphService } from './msGraphService';
import { Constants } from '../../core/constants';
import { Router } from '../../../../node_modules/@angular/router';
import { CacheService } from '@ngx-cache/core';
import { LocalStorage, LocalDatabase } from '@ngx-pwa/local-storage';

export class BaseComponent {
    Connection: typeof Connection = Connection;
    user: AuthUser;
    timeInterval: any;
    notFoundTip: string = Constants.notFoundTip;
    query: string;

    constructor(
        protected logger: Logger,
        public router: Router,
        public msalService?: MsalService,
        public msGraphService?: MsGraphService,
        public cacheService?: CacheService,
        public localStorage?: LocalDatabase
    ) { 
        this.user = new AuthUser();
    }

    logout() {
        this.msalService.logout();
    }

    //https://stackblitz.com/edit/angular-1yr75s?file=src%2Fapp%2Fapp.component.html
    createImageFromBlob(image: Blob, user: any) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            user.photo = reader.result;
            if (user.id) {
                $(<any>'.image' + user.id).attr("xlink:href", user.photo);
            }

            if (user.email == this.user.email) {
                this.localStorage.setItem("user", user).subscribe(() => {});
            }


            if (user.email == this.user.email 
                && this.cacheService.has("user") 
                && !this.cacheService.get("user").photo) {
                    this.cacheService.set("user", user);
            }
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    getUserInfos(): any {
        this.logger.info("cacheservice11", this.cacheService, this.cacheService.has("user"));

        // return this.localStorage.getItem("user").subscribe((user: any) => {
        //     this.logger.info("return user", user);

        //     if (user) {
        //         this.logger.info("has user", user);
        //         this.user = user;
        //     }
        //     else {
        //         this.timeInterval = interval(1000)
        //         .pipe(switchMap(() => this.msalService.getUser()))
        //         .subscribe((user: any) => {
        //             if (user.displayableId && !this.user.email) {
        //                 this.logger.info("user", user);
        //                 this.user = new AuthUser(user.name, user.displayableId);
        //                 this.msGraphService.getPhotoByUpn(this.user.email).subscribe((result) => {
        //                     this.createImageFromBlob(result, this.user);
        //                     this.logger.info("photo", this.user);
        //                 },
        //                     (error) => {
        //                         this.notFoundTip = `can't fetch the photo of ${this.user.email}`;
        //                         this.logger.error(`${this.notFoundTip} error: `, error);
        //                     })
        //                 this.logger.info("clear time interval", this.user.email);
        //                 this.timeInterval.unsubscribe();
        //             }
        //         });
        //     }
        // })

        if (this.cacheService.has("user")) {

            this.user = this.cacheService.get("user");
            // return this.cacheService.get("user").subscribe((user: AuthUser) => {
            //     this.user = user;
            // });
            this.logger.info("has user", this.user,  this.cacheService.has("user"), this.cacheService.get("user"));
            
            return empty().subscribe();
        } else {
            return this.timeInterval = interval(1000)
                .pipe(switchMap(() => this.msalService.getUser()))
                .subscribe((user: any) => {
                    if (user.displayableId && !this.user.email) {
                        this.logger.info("user", user);
                        this.user = new AuthUser(user.name, user.displayableId);
                        this.msGraphService.getPhotoByUpn(this.user.email).subscribe((result) => {
                            this.createImageFromBlob(result, this.user);
                            this.cacheService.set("user", this.user);
                            this.logger.info("photo", this.user);
                        },
                            (error) => {
                                this.notFoundTip = `can't fetch the photo of ${this.user.email}`;
                                this.logger.error(`${this.notFoundTip} error: `, error);
                            })
                        this.logger.info("clear time interval", this.user.email);
                        this.timeInterval.unsubscribe();
                    }
                });
        }

    }

    search(query: string) {
        if (!query) {
            return;
        }
        this.query = query;

        if (query.indexOf("@") != -1) {
            this.router.navigate(["search/graph"], {
                queryParams: {
                    "query": query.trim()
                }
            });
        } else {
            this.router.navigate(["search/topic"], {
                queryParams: {
                    "query": query.trim()
                }
            });
        }
    }
}