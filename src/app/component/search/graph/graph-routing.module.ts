import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { GraphComponent } from "./graph.component";

const graphRoutes: Routes = [
    {
        path: '',
        component: GraphComponent
    }
];


@NgModule({
    imports: [RouterModule.forChild(
        graphRoutes,
        //his outputs each router event that took place during each navigation lifecycle to the browser console
        //{ enableTracing: true } // <-- debugging purposes only
    )],
    exports: [RouterModule]
})
export class GraphRoutingModule { }