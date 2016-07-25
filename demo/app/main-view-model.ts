import {Observable} from 'data/observable';

import {TNSSession} from 'nativescript-opentok';

export class OpenTokDemo extends Observable {

    private _session: any;

    constructor() {
        super();
        this._session = new TNSSession('45614192', true, true);
        this._session.create(this.getSessionID()).then((result) => {
            this._session.connect(this.getToken()).then((result) => {
                this._session.publish(100, 100, 100, 100);
            }, (err) => {
                console.log('Error connecting');
            });
        }, (err) => {});
        this._session.delegate().sessionEvents.on('sessionDidConnect',  (eventData) => {
            console.log('sessionDidConnect', eventData);
        });
        this._session.publisher().delegate().publisherEvents.on('didChangeCameraPosition', (eventData) => {
            console.log('didChangeCameraPosition', eventData);
        });

    }

    toggleVideo() {
        this._session.toggleVideo().then((result) => {
            console.log('Set video stream state to: ' + result);
        }, (err) => {
            console.log('Error toggling video stream state: ' + err);
        });;
    }

    private getSessionID() {
        return '2_MX40NTYxNDE5Mn5-MTQ2ODk5NjUxMTM0MH5kaGRGY3ErdGUzVTFTY1N2TTJCUllkZ0x-fg';
    }

    private getToken() {
        return 'T1==cGFydG5lcl9pZD00NTYxNDE5MiZzaWc9ZTQzMTE0YjQ2M2ZlYWMzODZiZDYyZWJjYWJjZjM1ZWE2OTM0NGY1ODpzZXNzaW9uX2lkPTJfTVg0ME5UWXhOREU1TW41LU1UUTJPRGs1TmpVeE1UTTBNSDVrYUdSR1kzRXJkR1V6VlRGVFkxTjJUVEpDVWxsa1oweC1mZyZjcmVhdGVfdGltZT0xNDY4OTk2NTM0Jm5vbmNlPTAuMTE4ODU0NDgwNTYyNzMxNjImcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ3MTU4ODUzNA==';
    }

    /*
    // if(app.android) {
      //     console.log('Running Android');
      //     var openTokAndroid = new OpenTokAndroid();
      //     openTokAndroid.init('45614192', sessionID);
      //     openTokAndroid.doConnect(token);
      //     openTokAndroid.doPublish(app.android.context);
      // }
      // else if(app.ios) {
      //     console.log('Running iOS');
      //     var openTokiOS = new OpenTokiOS();
      //     openTokiOS.init('45614192', sessionID, page.ios);
      //     openTokiOS.doConnect(token);
      //     openTokiOS.doPublish(100, 100, 100, 100);
      //     openTokiOS.doPublish(0, 0, 100, 100);
      // }
  */
}