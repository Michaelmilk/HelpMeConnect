import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./component/notFound/pageNotFound.Component";
import { NgModule } from "@angular/core";

const appRoutes: Routes = [
    {
        path: '',
        loadChildren: './component/home/home.module#HomeModule'
    },
    {
        path: 'search',
        loadChildren: './component/search/search.module#SearchModule'
    },
    {
        path: 'graph',
        loadChildren: './component/graph/graph.module#GraphModule'
    },
    { path: '**', component: PageNotFoundComponent }
];


@NgModule({
    imports: [RouterModule.forRoot(
        appRoutes,
        //his outputs each router event that took place during each navigation lifecycle to the browser console
        //{ enableTracing: true } // <-- debugging purposes only
    )],
    exports: [RouterModule]
})
export class AppRoutingModule { }