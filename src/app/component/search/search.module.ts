import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './search.component';
import { SearchService } from './search.service';
import { SearchRoutingModule } from './search-routing.module';

@NgModule({
    declarations: [
        SearchComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        SearchRoutingModule
    ],
    providers: [
        SearchService
    ]
})
export class SearchModule { }
