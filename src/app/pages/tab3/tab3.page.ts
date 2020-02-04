import {Component, OnInit} from '@angular/core';
import {Usuario} from '../../interfaces/interfaces';
import {UsuarioService} from '../../services/usuario.service';
import {NgForm} from '@angular/forms';
import {UiServiceService} from '../../services/ui-service.service';
import {PostsService} from '../../services/posts.service';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

    private usuario: Usuario = {};

    constructor(private usuarioService: UsuarioService,
                private uiService: UiServiceService,
                private postsService: PostsService) {
    }

    ngOnInit(): void {
        this.usuario = this.usuarioService.getUsuario();
    }

    async actualizar(fActualizar: NgForm) {
        if (fActualizar.invalid) {
            return;
        }

        console.log(fActualizar);

        const actualizado = await this.usuarioService.actualizarUsuario(this.usuario);

        console.log(actualizado);

        if (actualizado) {
            this.uiService.presentToast('Registro actualizado');
        } else {
            this.uiService.presentToast('No se pudo actualizar');
        }
    }

    logout() {
        this.usuarioService.logout();
        this.postsService.paginaPosts = 0;
    }


}
