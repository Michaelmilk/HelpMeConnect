import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TopicComponent } from './topic.component';
import { TopicService } from './topic.service';
import { TopicRoutingModule } from './topic-routing.module';
import { SearchHeaderModule } from '../../../templates/searchHeader/searchHeader.module';


@NgModule({
    declarations: [
        TopicComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        SearchHeaderModule,
        TopicRoutingModule
    ],
    providers: [
        TopicService
    ]
})
export class TopicModule { }
