import {Component, EventEmitter, HostBinding, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {RegisterService} from './register.service';
import {LoginService} from '../login/login.service';
import {TypeClientEnums} from "../../enums/typeClient.enums";
import {Helper} from "../../shared/helper";
import {Select2OptionData} from "ng2-select2";
import {Collaborators} from "../../interfaces/collaborators";

@Component({
  selector: 'add-collaborators',
  templateUrl: './register.template.html',
  styleUrls: ['./register.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnInit{
  @HostBinding('class') classes = 'auth-page app';

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  typeClient: TypeClientEnums = TypeClientEnums.Maintainer;
  typeClientGroupe:  Select2OptionData[]
  select2Options: any=Helper.select2Options;
  @Output() addCollaboratorsEvent = new EventEmitter<boolean>();
  constructor(
    public loginService: LoginService,
    public registerService: RegisterService,
  ) {}

  ngOnInit(): void {
        this.typeClientGroupe = Object.values(TypeClientEnums).map((type)=> {
          return  {
            id: type,
            text: type,
          }
        })
    }

  public register() {
    const email = this.email;
    const password = this.password;
    const typeClient = this.typeClient;

    if (!this.isPasswordValid()) {
      this.checkPassword();
    } else {
      this.registerService.registerUser({email, password,typeClient}).subscribe(
        ()=>this.addCollaboratorsEvent.emit(true)
      );
    }
  }

  checkPassword() {
    if (!this.isPasswordValid()) {
      if (!this.password) {
        this.registerService.registerError('Password field is empty');
      } else {
        this.registerService.registerError('Passwords are not equal');
      }
      setTimeout(() => {
        this.registerService.registerError('');
      }, 3 * 1000);
    }
  }

  isPasswordValid() {
    return this.password && this.password === this.confirmPassword;
  }



  typeClientChanged($event: any) {
    this.typeClient = TypeClientEnums[$event.value] as TypeClientEnums;
  }
}
