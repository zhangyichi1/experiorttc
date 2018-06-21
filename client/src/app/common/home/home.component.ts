import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  images: Array<string>;

  constructor() {
    this.images = new Array<string>();
  }

  ngOnInit() {
    for(let i=0; i<4; i++) {
      let s: string = '/assets/img/' + i + '.jpg';
      this.images.push(s);
    }
  }

}
