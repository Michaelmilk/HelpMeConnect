import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";

const homeRoutes: Routes = [
  { path: '',  component: HomeComponent},
  { path: 'home',  component: HomeComponent},
  //{ path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(
    homeRoutes,
    //his outputs each router event that took place during each navigation lifecycle to the browser console
    //{ enableTracing: true } // <-- debugging purposes only
  ) ],
  exports: [ RouterModule ]
})
export class HomeRoutingModule {}