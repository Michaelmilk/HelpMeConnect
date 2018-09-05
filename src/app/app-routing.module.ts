import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./component/home/home.component";
import { PageNotFoundComponent } from "./component/notFound/pageNotFound.Component";
import { NgModule } from "@angular/core";

let allRoutes: Routes = [];

const appRoutes: Routes = [
  { path: 'home',  component: HomeComponent},
  //{ path: '', redirectTo: '/home', pathMatch: 'full' }
];

const wildcardRoutes: Routes = [
  { path: '**', component: PageNotFoundComponent }
];

allRoutes = allRoutes.concat(appRoutes, wildcardRoutes);

@NgModule({
  imports: [ RouterModule.forRoot(
    allRoutes,
    //his outputs each router event that took place during each navigation lifecycle to the browser console
    //{ enableTracing: true } // <-- debugging purposes only
  ) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}