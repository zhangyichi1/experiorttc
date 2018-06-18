import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  images: Array<string>;

  //try puttigg the images on the app_server
  //try puttigg the images on the app_server
  //try puttigg the images on the app_server

  constructor() {
    this.images = new Array<string>();
  }

  ngOnInit() {
    for(let i=0; i<4; i++) {
      let s: string = '/assets/img/' + i + '.jpg';
      this.images.push(s);
    }
    // this._http.get('https://picsum.photos/list')
    //     .pipe(map((images: Array<{id: number}>) => this._randomImageUrls(images)))
    //     .subscribe(images => this.images = images);
  }

  // private _randomImageUrls(images: Array<{id: number}>): Array<string> {
  //   return [1, 2, 3, 4].map(() => {
  //     const randomId = images[Math.floor(Math.random() * images.length)].id;
  //     return `https://picsum.photos/900/500?image=${randomId}`;
  //   });
  // }

}
