import {Observable} from 'data/observable';
import {OpenTok} from 'nativescript-opentok';

export class HelloWorldModel extends Observable {
  public message: string;
  private openTok: OpenTok;

  constructor() {
    super();

    this.openTok = new OpenTok();
    this.message = this.openTok.message;
  }
}