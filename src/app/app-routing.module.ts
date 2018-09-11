import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./component/notFound/pageNotFound.Component";
import { NgModule } from "@angular/core";
import { HomeComponent } from "./component/home/home.component";

const appRoutes: Routes = [
    {
        path: '',
        loadChildren: './component/home/home.module#HomeModule'
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