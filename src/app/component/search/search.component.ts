import { Component, OnInit } from '@angular/core';
import { AuthUser } from '../../core/authUser';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
    user: AuthUser;
    constructor(private router: Router,) { }

    ngOnInit() {
        console.log(this.router.url);

        this.user = new AuthUser();
    }

}
