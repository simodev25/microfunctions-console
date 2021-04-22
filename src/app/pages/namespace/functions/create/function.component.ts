import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ComponentAction, ComponentBase} from '../../../../interfaces/component';
import {Functions} from '../../../../interfaces/functions';
import {FunctionService} from '../../function.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Select2OptionData} from 'ng2-select2';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {generateNameFunction} from '../../../../utils/shared.utils';
import {Options} from 'ng5-slider';
import {Helper} from '../../../../shared/helper';
import {GitService} from '../git/git.service';
import {isValidCron} from "cron-validator";

@Component({
  selector: 'functionCreate',
  templateUrl: './function.template.html',
  styleUrls: ['./function.style.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class FunctionCreateComponent extends ComponentBase implements OnInit, OnDestroy {
  namespace: string;
  functionForm: FormGroup;
  idNamespace;
  events: string[] = [];
  value: number = 5;
  regexNameFunction = /[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
  memoryOptions: Options = {
    showTicksValues: true,
    showSelectionBar: true,
    disabled: true,
    stepsArray: [
      {value: 128},
      {value: 256},
      {value: 512},
      {value: 1024},
      {value: 2048},
    ]
  };
  cpuOptions: Options = {
    showTicksValues: true,
    showSelectionBar: true,
    disabled: true,
    stepsArray: [
      {value: 50},
      {value: 100},
      {value: 200},
      {value: 400},
      {value: 800},
      {value: 1000},
      {value: 2000},
    ]
  };
  triggerGroupe: Select2OptionData[] =
    [
      {
        id: 'https',
        text: 'Https',
      },
      {
        id: 'services',
        text: 'Services',
      }, {
      id: 'cronjob',
      text: 'CronJob',
    }];
  averageUtilizationGroupe: Select2OptionData[] =
    [
      {
        id: '40',
        text: '40 %',
      },
      {
        id: '50',
        text: '50 %',
      },
      {
        id: '60',
        text: '60 %',
      }, {
      id: '80',
      text: '80 %',
    }];
  minMaxGroupe: Select2OptionData[] =
    [
      {
        id: '1',
        text: '1',
      }, {
      id: '2',
      text: '2',
    }, {
      id: '3',
      text: '3',
    }, {
      id: '4',
      text: '4',
    }, {
      id: '5',
      text: '5',
    }, {
      id: '6',
      text: '6',
    }, {
      id: '8',
      text: '8',
    }]

  runtimeGrouped: Select2OptionData[] =
    [{
      id: 'nodejs',
      text: 'Node.js',
      children: [
        {
          id: 'nodejs12',
          text: 'Node.js:12'
        }
      ]
    },
      {
        id: 'python',
        text: 'Python',
        children: [
          {
            id: 'python3.7',
            text: 'python:3.7'
          }
        ]
      },
      {
        id: 'go',
        text: 'Go',
        children: [
          {
            id: 'go1.14',
            text: 'go:1.14'
          }
        ]
      },
    ];


  replicasOptions: Options = {
    showTicksValues: true,
    showSelectionBar: true,
    stepsArray: [
      {value: 1},
      {value: 2},
      {value: 3},
      {value: 4},
    ]
  };
  codeEditorisloaded: boolean = false;
  packageEditorisloaded: boolean = false;
  editorSelectd: string = 'INDEX';
  //fullscreen: boolean = true;
  private defaultRuntime = 'nodejs12';
  refresh: boolean = false;
  runtime = Helper.runtime[this.defaultRuntime]


  @ViewChild('fullScreen', {static: true}) divRef;

  codeOptions = {
    theme: 'chrome-devtools', language: this.runtime.language, contextmenu: true, automaticLayout: true, minimap: {
      enabled: false,
    }
  };
  dependenciesOptions = {
    theme: 'chrome-devtools', language: this.runtime.dependencies, contextmenu: true, automaticLayout: true, minimap: {
      enabled: false,
    }
  };


  constructor(protected functionService: FunctionService,
              protected router: Router,
              protected route: ActivatedRoute,
              protected fb: FormBuilder,
              protected gitService: GitService) {
    super();
    this.title = 'Create Function';
    this.componentAction = ComponentAction.CREATE;

  }


  onEditorSelectdChanged(value) {
    this.editorSelectd = value;

    this.events = this.events.filter((even) => even !== value);

  }

  onCodeloaded() {
    this.codeEditorisloaded = true;
  }

  onDependenciesloaded() {
    this.packageEditorisloaded = true;
  }

  onAllocatedChangeDisabled(): void {
    this.memoryOptions = Object.assign({}, this.memoryOptions, {disabled: !this.functionForm.get('allocated').value});
    this.cpuOptions = Object.assign({}, this.cpuOptions, {disabled: !this.functionForm.get('allocated').value});
    if(!this.functionForm.get('allocated').value){
      this.functionForm.get('autoscaler').get('enabled').setValue(false);
    }
  }

  disabledTrigger() {
    this.triggerGroupe.forEach((t) => t.disabled = true)
  }

  disabledRuntime() {
    this.runtimeGrouped.forEach((t) => t.disabled = true)
  }


  submitFunction() {

    if (!this.functionForm.valid) {
      this.functionService.toastr.error('Function has not  been Created!');
      return;
    }
    this.submitted = true;
    const functions: Functions = this.functionForm.value;
    console.log(functions)

    this.updating();
    this.functionService.createFunctions(this.idNamespace, functions).subscribe((responseKub: any) => {
      this.router.navigate(['/microfunctions/namespace/', this.idNamespace]);

      this.isUpdating = false;
      this.submitted = false;
    }, error => {

      this.isUpdating = false;

    });
  }


  goBack() {
    this.router.navigate(['/microfunctions/namespace/', this.idNamespace]);
  }

  ngOnInit(): void {
    this.idNamespace = this.route.params['value'].idNamespace;
    this.initFunctionForm();
    this.gitObservable();

  }

  gitObservable() {
    this.gitService.indexjs$.subscribe((indexjs) => {
      this.functionForm.get('sourceCode').setValue(indexjs);
      this.events.push('INDEX');
    });
    this.gitService.dependencies$.subscribe((packagejson) => {
      this.functionForm.get('dependencies').setValue(JSON.stringify(packagejson));
      this.events.push('PACKAGE');
    });
    this.gitService.env$.subscribe((envs: any[]) => {
      this.addsEnvironment(envs);
      this.events.push('ENV');
    });
  }

  initFunctionForm() {

    this.functionForm = this.fb.group({
        name: new FormControl(generateNameFunction(), [Validators.required,
          Validators.minLength(6),
          Validators.maxLength(24),
          Validators.pattern(this.regexNameFunction)
        ]),

        memory: new FormControl(128, Validators.required),
        cpu: new FormControl(100, Validators.required),
        allocated: new FormControl(false, Validators.required),
        replicas: new FormControl(1, Validators.required),
        runtime: new FormControl(this.defaultRuntime, Validators.required),
        trigger: new FormControl('https', Validators.required),
        crontab: new FormControl(''),
        executedName: new FormControl('Helloworld', [Validators.required,
          Validators.minLength(6),
          Validators.maxLength(16),
          Validators.pattern(this.regexNameFunction),
        ]),
        sourceCode: [this.runtime.codeModelDefaultValue, Validators.required],
        dependencies: [this.runtime.dependenciesCode],
        environments: this.fb.array([]),
        autoscaler: new FormGroup({
          enabled: new FormControl(false, Validators.required),
          averageCpu: new FormControl('80'),
          averageMemory: new FormControl('80'),
          minReplicas: new FormControl(1),
          maxReplicas: new FormControl(4),
        }),
      }, {
        validators: [this.executedNameIsValide, this.crontab]
      }
    );
  }

  crontab: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const trigger = control.get('trigger');
    const crontab = control.get('crontab');
    return trigger.value === 'cronjob' && !isValidCron(crontab.value) ? {'crontabIsValide': true} : null;
  }
  executedNameIsValide: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const sourceCode = control.get('sourceCode');
    const executedName = control.get('executedName');
    return sourceCode && executedName && !sourceCode.value.toString().includes(executedName.value) ? {'executedNameIsValide': true} : null;
  };


  runtimeChanged(runtime) {
    this.runtime = Helper.runtime[runtime.data[0].id];
    this.functionForm.get('runtime').setValue(runtime.value);
    this.functionForm.get('sourceCode').setValue(this.runtime.codeModelDefaultValue);
    this.functionForm.get('dependencies').setValue(this.runtime.dependenciesCode);
    this.codeOptions.language = this.runtime.language;
    this.dependenciesOptions.language = this.runtime.dependencies;


  }

  triggerChanged(trigger) {
    this.functionForm.get('trigger').setValue(trigger.value);
  }

  createEnvironment(): FormGroup {
    return this.fb.group({
      name: new FormControl('', [Validators.required,
        Validators.pattern('^[a-zA-Z_][a-zA-Z0-9_]*$')
      ]),
      value: new FormControl('', [Validators.required]),
    });
  }


  addEnvironment(environment?: {
    name: string,
    value: string,
  }): void {
    const items: FormArray = this.functionForm.get('environments') as FormArray;

    !environment ? items.push(this.createEnvironment()) : items.push(this.initEnvironment(environment));
  }

  addsEnvironment(environments: {
    name: string,
    value: string,
  }[]): void {
    const items: FormArray = this.functionForm.get('environments') as FormArray;
    items.clear();
    environments.forEach((env) => this.addEnvironment(env));
  }


  removeEnvironment(index) {
    const items: FormArray = this.functionForm.get('environments') as FormArray;
    items.removeAt(index);
  }

  initEnvironments(environments: {
    name: string,
    value: string,
  }[]): any {
    const envs: any[] = [];
    environments.forEach((environment: {
      name: string,
      value: string,
    }) => {
      envs.push(this.initEnvironment(environment));
    });
    return envs;
  }

  initEnvironment(environment: {
    name: string,
    value: string,
  }): FormGroup {
    return this.fb.group({
      name: new FormControl(environment.name, [Validators.required,
        Validators.pattern('^[a-zA-Z_][a-zA-Z0-9_]*$')
      ]),
      value: new FormControl(environment.value, [Validators.required]),
    });
  }

  get environmentErrors() {
    const items: FormArray = this.functionForm.get('environments') as FormArray;
    const err: any = [];
    items.controls.filter((control) => {
      return control.get('name').errors || control.get('value').errors;
    }).forEach((control) => {

      if (control.get('name').errors && err.toString().indexOf(control.get('name').errors) < 0) {
        err.push(control.get('name').errors);
      }

      if (control.get('value').errors && err.toString().indexOf(control.get('value').errors) < 0) {
        err.push(control.get('value').errors);
      }

    });

    return err;
  }


  ngOnDestroy(): void {
    this.unsubscribe();
  }

  codeSourceChange(sourceCode: unknown) {
    this.functionForm.get('sourceCode').setValue(sourceCode);
  }

  dependenciesChange(dependencies: any) {
    console.log(dependencies)
    this.functionForm.get('dependencies').setValue(dependencies);
  }

  replicasChanged() {

  }

  onAutoscalerChangeDisabled() {

  }

  OnAverageUtilizationCpuChanged(average) {
    this.functionForm.get('autoscaler').get('averageCpu').setValue(average.value);
  }

  OnAverageUtilizationMemoryChanged(average) {
    this.functionForm.get('autoscaler').get('averageMemory').setValue(average.value);
  }

  OnMinReplicasChanged(min) {
    this.functionForm.get('autoscaler').get('minReplicas').setValue(min.value);
  }

  OnMaxReplicasChanged(max) {
    this.functionForm.get('autoscaler').get('maxReplicas').setValue(max.value);
  }
}
