import {Component} from '@angular/core';
import {PostsService} from '../../services/posts.service';
import {Router} from '@angular/router';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Camera} from '@ionic-native/camera/ngx';

declare var window: any;

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
    tempImages: string[] = [];

    post = {
        mensaje: '',
        coords: null,
        posicion: false
    };
    cargandoGeo = false;

    constructor(private postsService: PostsService,
                private route: Router,
                private geolocation: Geolocation,
                private camera: Camera) {
    }

    async crearPost() {
        const creado = await this.postsService.crearPost(this.post);

        this.post = {
            mensaje: '',
            coords: null,
            posicion: false
        };

        this.route.navigateByUrl('/main/tabs/tab1');
    }

    getGeo() {
        if (!this.post.posicion) {
            this.post.coords = null;
            return;
        }

        this.cargandoGeo = true;

        this.geolocation.getCurrentPosition().then((resp) => {
            const coords = `${resp.coords.latitude},${resp.coords.longitude}`;
            this.post.coords = coords;
            this.cargandoGeo = false;
        }).catch((error) => {
            console.log('Error getting location', error);
            this.cargandoGeo = false;
        });


    }

    camara() {

        const options = {
            quality: 60,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType: this.camera.PictureSourceType.CAMERA
        };

        this.procesarImagen(options);
    }

    libreria() {
        const options = {
            quality: 60,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        };
        this.procesarImagen(options);
    }

    private procesarImagen(options) {
        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            // let base64Image = 'data:image/jpeg;base64,' + imageData;

            const img = window.Ionic.WebView.convertFileSrc(imageData);
            console.log(img);

            this.postsService.subirImagen(img);
            this.tempImages.push(img);
        }, (err) => {
            // Handle error
        });
    }
}
