import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { TopicComponent } from "./topic.component";

const topicRoutes: Routes = [
    {
        path: '',
        component: TopicComponent
    }
];


@NgModule({
    imports: [RouterModule.forChild(
        topicRoutes,
        //his outputs each router event that took place during each navigation lifecycle to the browser console
        //{ enableTracing: true } // <-- debugging purposes only
    )],
    exports: [RouterModule]
})
export class TopicRoutingModule { }