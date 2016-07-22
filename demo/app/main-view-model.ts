import {Observable} from 'data/observable';

import {TNSSession} from 'nativescript-opentok';

export class OpenTokDemo extends Observable {

    private session: any;

    constructor() {
        super();
        this.session = new TNSSession('45614192');
        this.session.create(this.getSessionID()).then((result) => {
            this.session.connect(this.getToken()).then((result) => {
                this.session.publish(100, 100, 100, 100);
            }, (err) => {
                console.log('Error connecting');
            });
        }, (err) => {});
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