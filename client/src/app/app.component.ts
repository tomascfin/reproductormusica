import {Component, Inject, OnInit} from '@angular/core';
import {User} from "./models/user";
import {UserService} from "./services/user.service";
import {identity} from "rxjs/util/identity";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [UserService]
})
export class AppComponent implements OnInit {
    public title = 'app tomas  !';
    public user: User;
    public identity;
    public token;
    public errorMessage;
    public user_register: User;
    public alertRegister;

    constructor(private _userService: UserService) {
        this.user = new User('', '', '', '', '', 'ROLE_USER', '');
        this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
    }

    ngOnInit() {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();

        //console.log(this.identity);
        //console.log(this.token);
    }

    public enSubmit() {

        console.log(this.user);
        //conseguir los datos del usuario identificado
        this._userService.signup(this.user).subscribe(
            response => {
                let identity = response.user;
                this.identity = identity;
                if (!this.identity._id) {
                    alert("El usuario no está correctamente identificado")
                } else {
                    //Crear elemento en el localstorage para tener al usuario en sesion
                    localStorage.setItem("identity", JSON.stringify(identity));
                    //conseguir el token para enviarselo a cada peticion http
                    this._userService.signup(this.user, 'true').subscribe(
                        response => {
                            let token = response.token;
                            this.token = token;
                            if (this.token.length <= 0) {
                                alert("El token no se ha generado")
                            } else {
                                //Crear elemento en el localstorage para tener al usuario en sesion
                                localStorage.setItem("token", token);
                                console.log(token);
                                console.log(identity);
                                //conseguir el token para enviarselo a cada peticion http

                            }
                        },
                        error => {
                            var errorMessage = <any> error;

                            if (error != null) {
                                var body = JSON.parse(error._body);
                                this.errorMessage = body.message;
                                console.log(error);
                            }
                        }
                    );
                }
            },
            error => {
                var errorMessage = <any> error;

                if (error != null) {
                    var body = JSON.parse(error._body);
                    this.errorMessage = body.message;
                    console.log(error);
                }
            }
        );
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("identity");
        localStorage.clear();
        this.identity = null;
        this.token = null;
    }

    enSubmitRegister() {
        console.log(this.user_register);
        this._userService.register(this.user_register).subscribe(
            response => {
                let user = response.user;
                this.user_register = user;

                if(!user._id){
                    alert('Error al registrarse');
                }else{
                    this.alertRegister = 'El registro se ha realizado correctamente, identificate con '+this.user_register.email;
                    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
                }
            },
            error => {
                var errorMessage = <any> error;

                if (error != null) {
                    var body = JSON.parse(error._body);
                    this.alertRegister = body.message;
                    console.log(error);
                }
            }
        );
    }
}
