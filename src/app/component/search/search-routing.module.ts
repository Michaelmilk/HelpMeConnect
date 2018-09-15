import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

const searchRoutes: Routes = [
    {
        path: 'graph',
        loadChildren: './graph/graph.module#GraphModule'
    },
    {
        path: 'topic',
        loadChildren: './topic/topic.module#TopicModule'
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