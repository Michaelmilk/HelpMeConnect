import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { SearchComponent } from "./search.component";

const searchRoutes: Routes = [
    {
        path: '',
        component: SearchComponent
    }
];


@NgModule({
    imports: [RouterModule.forChild(
        searchRoutes,
        //his outputs each router event that took place during each navigation lifecycle to the browser console
        //{ enableTracing: true } // <-- debugging purposes only
    )],
    exports: [RouterModule]
})
export class SearchRoutingModule { }