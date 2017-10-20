import {Component, Inject, OnInit} from '@angular/core';
import {User} from "./models/user";
import {UserService} from "./services/user.service";

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

    constructor(private _userService: UserService) {
        this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    }

    ngOnInit() {

    }

    public onSubmit() {

        console.log(this.user);

        this._userService.signup(this.user).subscribe(
            response => {
                console.log(response);
            },
            error => {
                var errorMessage = <any> error;

                if (error != null) {
                    console.log(error);
                }
            }
        );
    }
}
