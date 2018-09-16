import {HttpClient} from '@angular/common/http';


import { Logger } from '../../helper/logger';
import { environment } from '../../../environments/environment';
import { MsalService } from '../../helper/msal/msal.service';

export class BaseService {
	serverUrl: string = environment.serverBaseUrl;
    msGraphUrl = environment.msGraphBaseUrl;

    constructor(
        public logger: Logger, 
        public httpClient: HttpClient    ) {
	}
}