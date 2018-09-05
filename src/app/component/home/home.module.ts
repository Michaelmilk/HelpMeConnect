import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { HomeService } from './home.service';
import { HomeRoutingModule } from './home-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
    declarations: [
       HomeComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        HomeRoutingModule,
        NgxGraphModule,
        NgxChartsModule,
    ],
    providers: [
        HomeService
    ]
})
export class HomeModule { }
