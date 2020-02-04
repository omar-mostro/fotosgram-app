import {Component, Input, OnInit, ViewChild} from '@angular/core';

declare var mapboxgl: any;

@Component({
    selector: 'app-mapa',
    templateUrl: './mapa.component.html',
    styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {

    @Input() coords: string;
    @ViewChild('mapa', {static: true}) mapa;

    constructor() {
    }

    ngOnInit() {

        const latLng = this.coords.split(',');
        const lat = Number(latLng[0]);
        const lng = Number(latLng[1]);

        mapboxgl.accessToken = 'pk.eyJ1Ijoib21hci1tb3N0cm8iLCJhIjoiY2s0eXU4d2Q3MDA1dTNkcXRhcTJxYnc5dSJ9._-2-VnoGXylv5SHvlGZsVw';
        const map = new mapboxgl.Map({
            container: this.mapa.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: 15
        });

        const marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map);
    }

}
