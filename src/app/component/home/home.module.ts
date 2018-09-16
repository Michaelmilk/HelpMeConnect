import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { HomeService } from './home.service';
import { HomeRoutingModule } from './home-routing.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    declarations: [
       HomeComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        HomeRoutingModule
    ],
    providers: [
        HomeService
    ]
})
export class HomeModule { }
