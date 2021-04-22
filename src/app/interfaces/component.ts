import {Helper} from '../shared/helper';
import {Subscription} from 'rxjs';

export enum ComponentAction {
  CREATE = 'Create',
  EDITE = 'Edite',
}

export class ComponentBase {
  title: string;
  componentAction: string;
  _isReceiving: boolean = false;
  _isUpdating: boolean = false;
  _isDeleting: boolean = false;
  _idToDelete: string[] = [];
  _idToStop: string[] = [];
  _submitted: boolean = false;
  _isStopping: boolean = false;
  _isStart: boolean = false;
  _idToStart: string[] = [];
  _errorMessage: string = '';
  subscriptions: Subscription[] = [];

  get Object() {
    return Object;
  }

  get ComponentAction() {
    return ComponentAction;
  }

  get submitted() {
    return this._submitted;
  }

  set submitted(val: boolean) {
    this._submitted = val;
  }

  get errorMessage() {
    return this._errorMessage;
  }

  set errorMessage(val: string) {
    this._errorMessage = val;
  }

  receives() {
    this.isReceiving = false;
  }


  receive() {
    this.isReceiving = false;
  }

  receiving() {
    this.isReceiving = true;
  }

  get isReceiving() {
    return this._isReceiving;
  }
  get isStopping() {
    return this._isStopping;
  }

  set isStopping(_isStopping) {
    this._isStopping = _isStopping;
  }
  get isStart() {
    return this._isStart;
  }

  set isStart(isStart) {
    this._isStart = isStart;
  }


  set isReceiving(isReceiving) {
    this._isReceiving = isReceiving;
  }

  updating() {
    this.isUpdating = true;
  }

  get isUpdating() {
    return this._isUpdating;
  }

  set isUpdating(isUpdating) {
    this._isUpdating = isUpdating;
  }

  get isDeleting() {
    return this._isDeleting;
  }

  set isDeleting(isDeleting) {
    this._isDeleting = isDeleting;
  }

  get idsToDelete(): string[] {
    return this._idToDelete;
  }

  set idToDelete(idToDelete: string) {
    this._idToDelete.push(idToDelete);
  }
  get idsToStop(): string[] {
    return this._idToStop;
  }

  set idToStop(idToStop: string) {
    this._idToStop.push(idToStop);
  }
  get idsToStart(): string[] {
    return this._idToStart;
  }

  set idToStart(idToStart: string) {
    this._idToStart.push(idToStart);
  }

  get select2Options() {
    return Helper.select2Options;
  }

  unsubscribe() {

    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this.subscriptions = [];
  }

  fullscreen(selector:string){
    const fullscreen = document.querySelector(selector);
    if (!document.fullscreenElement && fullscreen) {
      fullscreen.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }


  /* To copy Text from Textbox */
  copyInputMessage(value: any) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
