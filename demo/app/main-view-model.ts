import {Observable} from 'data/observable';

import { TNSOTSession} from 'nativescript-opentok';

export class OpenTokDemo extends Observable {

    private _session: any;

    constructor() {
        super();

        this._session = new TNSOTSession('45628212');
        this._session.create(this.getSessionID()).then((result) => {
            this._session.connect(this.getToken()).then((result) => {
                this._session.publish(300, 300, 450, 450);
            }, (err) => {
                console.log('Error connecting');
            });
        }, (err) => {});
        this._session.instance().sessionEvents.on('sessionDidConnect',  (eventData) => {
            console.log('sessionDidConnect', eventData);
        });
        // this._session.publisher().instance().publisherEvents.on('didChangeCameraPosition', (eventData) => {
        //     console.log('didChangeCameraPosition', eventData);
        // });

    }

    togglePublisherVideo() {
        this._session.publisher().toggleVideo().then((result) => {
            console.log('Set video stream state to: ' + result);
        }, (error) => {
            console.log('Error toggling video stream state: ' + error);
        });;
    }

    togglePublisherAudio() {
        this._session.publisher().toggleAudio();
    }

    togglePublisherCamera() {
        this._session.publisher().toggleCameraPosition();
    }

    private getSessionID() {
        return '1_MX40NTYyODIxMn5-MTQ2OTY0NjU3OTA2NX5aSjVYVndXREx4QUY3QjJOTGt1RGxDS0Z-fg';
    }

    private getToken() {
        return 'T1==cGFydG5lcl9pZD00NTYyODIxMiZzaWc9ZTFlM2Q4MjYxZDI4ZDQzZjBhYWEzYzlkOGIxZGI1Mjg3YTY1NGE0ODpzZXNzaW9uX2lkPTFfTVg0ME5UWXlPREl4TW41LU1UUTJPVFkwTmpVM09UQTJOWDVhU2pWWVZuZFhSRXg0UVVZM1FqSk9UR3QxUkd4RFMwWi1mZyZjcmVhdGVfdGltZT0xNDY5NjQ2NTk5Jm5vbmNlPTAuMzQyMTI5NjI2MDc4NTMxMTUmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ3MjIzODU5OQ==';
    }

}