import {NgModule} from '@angular/core';
import {NewWidgetModule} from '../layout/new-widget/widget.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {
  AccordionModule,
  AlertModule,
  BsDropdownModule,
  ButtonsModule, CollapseModule,
  ModalModule,
  PopoverModule,
  ProgressbarModule,
  TooltipModule
} from 'ngx-bootstrap';
import {LoaderModule} from '../components/loader/loader.module';
import {WidgetModule} from '../layout/widget/widget.module';
import {Select2Module} from 'ng2-select2';
import {Ng5SliderModule} from 'ng5-slider';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgePipe} from '../layout/utils/pipes/age.pipe';
import {MemoryPipe} from '../layout/utils/pipes/memory.pipe';
import {CpuPipe} from '../layout/utils/pipes/cpu.pipe';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NewWidgetModule,
    NgxDatatableModule,
    LoaderModule,
    ModalModule,
    WidgetModule,
    Select2Module,
    Ng5SliderModule,
    AlertModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    AccordionModule.forRoot(),
    ProgressbarModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
  ]
  ,
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NewWidgetModule,
    NgxDatatableModule,
    LoaderModule,
    ModalModule,

    Select2Module,
    Ng5SliderModule,
    AgePipe,
    MemoryPipe,
    CpuPipe

  ],
  declarations: [
    AgePipe,
    MemoryPipe,
    CpuPipe
  ]
})
export class SharedModule {


}
