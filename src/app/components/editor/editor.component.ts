import {Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {EditorComponent} from "ngx-monaco-editor";

interface options {
  theme: string,
  language: string,
  contextmenu: boolean,
  automaticLayout: boolean,
  minimap: {
    enabled: boolean,
  }
}

@Component({
  selector: 'mf-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MEditorComponent {
  @Output() codeChange = new EventEmitter();
  @Input() value: string;
  @Input() disabled = false;
  @ViewChild('editor', {static: true}) editor: EditorComponent;
  monacoEditor: any;
  @Input('options')
  options: options;
  _language:string;

  @Input('language') set language(language: string ){
    this._language =language;
    if(this.monacoEditor){
      this.updateOptions()
    }
  }

  editorOptions: options = {
    theme: 'chrome-devtools', language: this._language, contextmenu: true, automaticLayout: true, minimap: {
      enabled: false,
    }
  };

  constructor() {
  }

  onInit(editor) {
    this.monacoEditor = editor;
    this.updateOptions()

  }
  updateOptions(){
    this.monacoEditor.updateOptions({
      language: this._language,
      readOnly: this.disabled
    });
    const model = this.monacoEditor.getModel(); // we'll create a model for you if the editor created from string value.
    (window as any).monaco.editor.setModelLanguage(model, this._language)
  }


  onChange() {
    if (this.value && this.value.trim()) {

      this.codeChange.emit(this.value);
    }else {
      this.codeChange.emit(null);
    }
  }
}
