import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IonSlides, NavController} from '@ionic/angular';
import {UsuarioService} from '../../services/usuario.service';
import {UiServiceService} from '../../services/ui-service.service';
import {Usuario} from '../../interfaces/interfaces';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    @ViewChild('slidePrincipal', {static: true}) slides: IonSlides;



    loginUser = {
        email: 'test@test.com',
        password: '123123',
    };

    registerUser: Usuario = {
        email: 'test21',
        password: '123123',
        nombre: 'wawawa',
        avatar: 'av-1.png',
    };

    constructor(private usuarioService: UsuarioService,
                private navController: NavController,
                private uiService: UiServiceService
    ) {
    }

    ngOnInit() {
        this.slides.lockSwipes(true);
    }

    async login(fLogin: NgForm) {
        if (fLogin.invalid) {
            return;
        }

        const valido = await this.usuarioService.login(this.loginUser.email, this.loginUser.password);

        if (valido) {
            // navegar al tabs
            this.navController.navigateRoot('/main/tabs/tab1', {animated: true});
        } else {
            // mostrar alerta de usuario y contraseña incorrectas
            this.uiService.alertaInformativa('Usuario y contraseña incorrectos');

        }
    }

    async registro(fRegistro: NgForm) {
        if (fRegistro.invalid) {
            return;
        }

        const valido = await this.usuarioService.registro(this.registerUser);

        if (valido) {
            // navegar al tabs
            this.navController.navigateRoot('/main/tabs/tab1', {animated: true});
        } else {
            // mostrar alerta de usuario y contraseña incorrectas
            this.uiService.alertaInformativa('Ese correo electronico ya existe');

        }

    }

    mostrarRegistros() {
        this.slides.lockSwipes(false);
        this.slides.slideTo(0);
        this.slides.lockSwipes(true);

    }

    mostrarLogin() {
        this.slides.lockSwipes(false);
        this.slides.slideTo(1);
        this.slides.lockSwipes(true);

    }
}
