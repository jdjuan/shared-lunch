import { Component } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items: FirebaseListObservable<any[]>;
  test: FirebaseObjectObservable<any>;


  constructor(db: AngularFireDatabase) {
    this.items = db.list('/users');
    this.test = db.object('/test');
    this.test.subscribe(x => {
      // console.log('x', x);
    });
    this.items.subscribe(x => {
      console.log('x', x);
    });
  }
}
