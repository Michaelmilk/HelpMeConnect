import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraphRoutingModule } from './graph-routing.module';
import { GraphComponent } from './graph.component';
import { GraphService } from './graph.service';
import { SearchHeaderModule } from '../../../templates/searchHeader/searchHeader.module';

@NgModule({
    declarations: [
        GraphComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        SearchHeaderModule,
        GraphRoutingModule,
        NgxGraphModule,
        NgxChartsModule,
    ],
    providers: [
        GraphService
    ]
})
export class GraphModule { }
