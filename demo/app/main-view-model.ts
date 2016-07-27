import {Observable} from 'data/observable';

import {TNSOTSession} from 'nativescript-opentok';

export class OpenTokDemo extends Observable {

    private _session: any;

    constructor() {
        super();
        this._session = new TNSOTSession('45614192', true, true);
        this._session.create(this.getSessionID()).then((result) => {
            this._session.connect(this.getToken()).then((result) => {
                this._session.publish(300, 300, 450, 450);
            }, (err) => {
                console.log('Error connecting');
            });
        }, (err) => {});
        // this._session.delegate().sessionEvents.on('sessionDidConnect',  (eventData) => {
        //     console.log('sessionDidConnect', eventData);
        // });
        // this._session.publisher().delegate().publisherEvents.on('didChangeCameraPosition', (eventData) => {
        //     console.log('didChangeCameraPosition', eventData);
        // });

    }

    toggleVideo() {
        this._session.publisher().toggleVideo().then((result) => {
            console.log('Set video stream state to: ' + result);
        }, (error) => {
            console.log('Error toggling video stream state: ' + error);
        });;
    }

    toggleAudio() {

    }

    toggleCamera() {
        this._session.publisher().toggleCameraPosition();
    }

    private getSessionID() {
        return '2_MX40NTYxNDE5Mn5-MTQ2ODk5NjUxMTM0MH5kaGRGY3ErdGUzVTFTY1N2TTJCUllkZ0x-fg';
    }

    private getToken() {
        return 'T1==cGFydG5lcl9pZD00NTYxNDE5MiZzaWc9ZTQzMTE0YjQ2M2ZlYWMzODZiZDYyZWJjYWJjZjM1ZWE2OTM0NGY1ODpzZXNzaW9uX2lkPTJfTVg0ME5UWXhOREU1TW41LU1UUTJPRGs1TmpVeE1UTTBNSDVrYUdSR1kzRXJkR1V6VlRGVFkxTjJUVEpDVWxsa1oweC1mZyZjcmVhdGVfdGltZT0xNDY4OTk2NTM0Jm5vbmNlPTAuMTE4ODU0NDgwNTYyNzMxNjImcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ3MTU4ODUzNA==';
    }

}