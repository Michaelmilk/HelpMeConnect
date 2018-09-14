import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "../../../../node_modules/@angular/common";
import { SearchHeaderComponent } from "./searchHeader.component";


@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        SearchHeaderComponent
    ],
    declarations: [
        SearchHeaderComponent
    ]
})

export class SearchHeaderModule { }