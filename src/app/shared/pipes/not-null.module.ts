import { NgModule } from "@angular/core";
import { NotNullPipe } from "./not-null.pipe";

@NgModule({
    declarations: [
        NotNullPipe
    ],
    exports: [
        NotNullPipe
    ]
})
export class NotNullPipeModule { }