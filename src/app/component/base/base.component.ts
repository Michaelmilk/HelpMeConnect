import { Logger } from '../../helper/logger';
import * as $ from 'jquery';
import { Connection } from '../../core/graph/linkedGraph';
import { AuthUser } from '../../core/authUser';
import { interval } from '../../../../node_modules/rxjs';
import { switchMap } from '../../../../node_modules/rxjs/operators';
import { MsalService } from '../../helper/msal/msal.service';
import { MsGraphService } from './msGraphService';
import { Constants } from '../../core/constants';


export class BaseComponent {
    Connection: typeof Connection = Connection;
    user: AuthUser;
    timeInterval: any;
    notFoundTip: string = Constants.notFoundTip;

    constructor(
        protected logger: Logger,
        public msalService?: MsalService,
        public msGraphService?: MsGraphService
    ) { }

    ngOnInit(){
        
    }

    //https://stackblitz.com/edit/angular-1yr75s?file=src%2Fapp%2Fapp.component.html
    createImageFromBlob(image: Blob, user: any) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            user.photo = reader.result;
            if (user.id) {
                $(<any>'.image' + user.id).attr("xlink:href", user.photo);
            }
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    getUserInfos():any{
        this.user = new AuthUser();
        return this.timeInterval = interval(1000)
            .pipe(switchMap(() => this.msalService.getUser()))
            .subscribe((user: any) => {
                if (user.displayableId && !this.user.email) {
                    this.logger.info("user", user);
                    this.user = new AuthUser(user.name, user.displayableId);
                    this.msGraphService.getPhotoByUpn(this.user.email).subscribe((result) => {
                        this.createImageFromBlob(result, this.user);
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