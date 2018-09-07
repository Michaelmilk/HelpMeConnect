import { Logger } from '../../helper/logger';
import * as $ from 'jquery';
import { Connection } from '../../core/graph/linkedGraph';


export class BaseComponent {
    Connection: typeof Connection = Connection;

    constructor(
        protected logger: Logger
    ) { }

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
}