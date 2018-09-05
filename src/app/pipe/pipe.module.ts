import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';//ngModel
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafeUrlPipe } from './safeUrlPipe';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
    ],
    declarations: [
        SafeUrlPipe
    ],
    exports: [
        SafeUrlPipe
    ],
    providers: [
    ]
})

export class PipeModule { }
