import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Post, RespuestaPosts} from '../interfaces/interfaces';
import {UsuarioService} from './usuario.service';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer/ngx';


@Injectable({
    providedIn: 'root'
})
export class PostsService {

    private URL = environment.url;
    public paginaPosts = 0;
    private readonly headers: HttpHeaders;
    public nuevoPost = new EventEmitter<Post>();

    constructor(private http: HttpClient,
                private usuarioService: UsuarioService,
                private fileTransfer: FileTransfer,
    ) {
        this.headers = new HttpHeaders({
            'x-token': this.usuarioService.token
        });
    }

    getPosts(pull: boolean = false) {

        if (pull) {
            this.paginaPosts = 0;
        }

        this.paginaPosts++;
        const headers = this.headers;
        return this.http.get<RespuestaPosts>(`${this.URL}/post/?pagina=${this.paginaPosts}`, {headers});
    }

    crearPost(post) {
        const headers = this.headers;

        return new Promise(resolve => {
            this.http.post<RespuestaPosts>(`${this.URL}/post`, post, {headers})
                .subscribe(resp => {
                    // @ts-ignore
                    this.nuevoPost.emit(resp.post);

                    resolve(true);
                });
        });
    }

    subirImagen(img: string) {

        console.log('imagen', img);

        const options: FileUploadOptions = {
            fileKey: 'image',
            fileName: 'name.jpg',
            headers: {
                'x-token': this.usuarioService.token
            }
        };

        const fileTransfer: FileTransferObject = this.fileTransfer.create();

        fileTransfer.upload(img, `${this.URL}/post/upload`, options)
            .then(data => {
                console.log(data);
            }).catch(err => {
            console.log('error en carga', err);
        });

    }
}
