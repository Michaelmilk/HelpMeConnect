import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";

const homeRoutes: Routes = [
  { path: '',  component: HomeComponent}
];

@NgModule({
  imports: [ RouterModule.forChild(
    homeRoutes,
    //his outputs each router event that took place during each navigation lifecycle to the browser console
    //{ enableTracing: true } // <-- debugging purposes only
  ) ],
  exports: [ RouterModule ]
})
export class HomeRoutingModule {}