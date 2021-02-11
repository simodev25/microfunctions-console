import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ComponentAction} from '../../../../interfaces/component';
import {Functions} from '../../../../interfaces/functions';
import {FunctionService} from '../../function.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FunctionCreateComponent} from '../create/function.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GitService} from '../git/git.service';
import {Helper} from "../../../../shared/helper";


@Component({
  selector: 'function',
  templateUrl: '../create/function.template.html',
  styleUrls: ['../create/function.style.scss'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: true
})
export class FunctionEditeComponent extends FunctionCreateComponent implements OnInit, OnDestroy {
  function: Functions;
  idFunction;
  liveReplicas: boolean = false;

  constructor(protected functionService: FunctionService,
              protected router: Router,
              protected route: ActivatedRoute,
              protected fb: FormBuilder,
              protected gitService: GitService) {
    super(functionService, router, route, fb, gitService);
    this.title = 'Function edit';
    this.componentAction = ComponentAction.EDITE;
  }

  ngOnInit(): void {
    this.idNamespace = this.route.params['value'].idNamespace;
    this.idFunction = this.route.params['value'].idFunction;
    this.namespace = this.route.queryParams['value'].namespace;

    this.receiving();
    this.functionService.getFunction(this.idNamespace, this.idFunction).subscribe((function$: Functions) => {
      this.function = function$;
      super.ngOnInit();
      this.initFunctionForm();
      this.onAllocatedChangeDisabled();
      this.disabledTrigger();
      this.runtime = Helper.runtime[this.function.runtime];

      this.receives();
    });


  }

  removeTimestamps(logs: string) {
    const logstemps = logs.replace(/^\d+.*?\s/gm, '');
    return logstemps.replace(logstemps.substring(0, logstemps.indexOf('--[')), '');
  }

  goBack() {
    this.router.navigate(['/microfunctions/namespace/', this.idNamespace]);
  }

  submitFunction() {
    if (!this.functionForm.valid) {
      this.functionService.toastr.error('Function has not  been Created!');
      return;
    }

    this.submitted = true;
    const functions: Functions = this.functionForm.value;
    this.updating();
    this.functionService.updateFunctions(this.idNamespace, this.idFunction, functions).subscribe((responseKub: any) => {
      this.router.navigate(['/microfunctions/namespace/', this.idNamespace]);
      this.isUpdating = false;
      this.submitted = false;
    }, error => {
      this.isUpdating = false;

    });
  }

  initFunctionForm() {


    this.functionForm = this.fb.group({
      name: new FormControl({value: this.function.name, disabled: true}, Validators.required),
      memory: [this.function.memory],
      runtime: [this.function.runtime, Validators.required],
      executedName: [this.function.executedName, Validators.required],
      sourceCode: [this.function.sourceCode, Validators.required],
    });
    this.functionForm = this.fb.group({
      name: new FormControl({value: this.function.name, disabled: true}, [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(16),
        Validators.pattern(this.regexNameFunction)
      ]),
      memory: new FormControl(this.function.memory, Validators.required),
      cpu: new FormControl(this.function.cpu, Validators.required),
      allocated: new FormControl(this.function.allocated, Validators.required),
      replicas: new FormControl(this.function.replicas, Validators.required),
      runtime: new FormControl(this.function.runtime, Validators.required),
      trigger: new FormControl({value: this.function.trigger, disabled: true}, Validators.required),
      crontab: new FormControl(this.function.crontab),
      executedName: new FormControl(this.function.executedName, [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(16),
        Validators.pattern(this.regexNameFunction)
      ]),
      autoscaler: new FormGroup({
        enabled: new FormControl(this.function.autoscaler.enabled, Validators.required),
        averageCpu: new FormControl(this.function.autoscaler.averageCpu),
        averageMemory: new FormControl(this.function.autoscaler.averageMemory),
        minReplicas: new FormControl(this.function.autoscaler.minReplicas),
        maxReplicas: new FormControl(this.function.autoscaler.maxReplicas),
      }),
      sourceCode: [this.function.sourceCode, Validators.required],
      dependencies: [this.function.dependencies],
      environments: this.fb.array(this.initEnvironments(this.function.environments))
    }, {
      validators: this.executedNameIsValide
    });
  }

  switchliveReplicas() {
    this.liveReplicas = !this.liveReplicas;
  }

  replicasChanged() {
    if (this.liveReplicas) {
      this.functionService.liveScale(this.idNamespace, this.idFunction, this.functionForm.get('replicas').value).subscribe((data) => {
      });
    }


  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
