import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {environment} from '../../environments/environment';
import {Usuario} from '../interfaces/interfaces';
import {NavController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private URL = environment.url;
    public token = null;
    usuario: Usuario = {};

    constructor(private http: HttpClient,
                private storage: Storage,
                private navController: NavController
    ) {
    }

    login(email: string, password: string) {
        const data = {
            email,
            password
        };

        return new Promise(resolve => {
            this.http.post(`${this.URL}/user/login`, data)
                .subscribe(async resp => {
                    // @ts-ignore
                    if (resp.ok) {
                        // @ts-ignore
                        await this.guardarToken(resp.token);
                        resolve(true);
                    } else {
                        this.token = null;
                        this.storage.remove('token');
                        resolve(false);
                    }
                });
        });

    }

    registro(usuario: Usuario) {
        return new Promise(resolve => {
            this.http.post(`${this.URL}/user/create`, usuario)
                .subscribe(async resp => {
                    console.log(resp);
                    // @ts-ignore
                    if (resp.ok) {
                        // @ts-ignore
                        await this.guardarToken(resp.token);
                        resolve(true);
                    } else {
                        this.token = null;
                        this.storage.remove('token');
                        resolve(false);
                    }
                });
        });
    }

    getUsuario() {

        if (this.usuario._id) {
            this.validaToken();
        }

        return {...this.usuario};
    }

    async guardarToken(token: string) {
        this.token = token;
        await this.storage.set('token', token);

        await this.validaToken();
    }

    async cargarToken() {
        this.token = await this.storage.get('token') || null;
    }

    async validaToken(): Promise<boolean> {

        await this.cargarToken();

        if (!this.token) {
            this.navController.navigateRoot('/login');
            return Promise.resolve(false);
        }

        return new Promise<boolean>(resolve => {

            const headers = new HttpHeaders({
                'x-token': this.token
            });

            this.http.get(`${this.URL}/user/login`, {headers})
                .subscribe(resp => {
                    // @ts-ignore
                    if (resp.ok) {
                        // @ts-ignore
                        this.usuario = resp.usuario;
                        resolve(true);
                    } else {
                        this.navController.navigateRoot('/login');
                        resolve(false);
                    }
                });
        });
    }

    actualizarUsuario(usuario: Usuario) {
        const headers = new HttpHeaders({
            'x-token': this.token
        });

        return new Promise(resolve => {
            this.http.post(`${this.URL}/user/update`, usuario, {headers})
                .subscribe(resp => {

                    console.log(resp);

                    // @ts-ignore
                    if (resp.ok) {
                        // @ts-ignore
                        this.guardarToken(resp.token);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
        });

    }

    logout() {
        this.token = null;
        this.usuario = null;
        this.storage.remove('token');
        this.navController.navigateRoot('/login', {animated: true});
    }

}
