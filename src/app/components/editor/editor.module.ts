import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MEditorComponent} from "./editor.component";
import {FormsModule} from "@angular/forms";
import {MonacoEditorModule} from "ngx-monaco-editor";
@NgModule({
  declarations: [MEditorComponent],
  exports:[MEditorComponent],
  imports: [
    MonacoEditorModule.forRoot(),
    CommonModule,
    FormsModule
  ]
})
export class EditorModule { }
