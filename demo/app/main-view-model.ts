///<reference path="../node_modules/nativescript-opentok/opentok.ios.d.ts"/>

import {Observable} from 'data/observable';

import { TNSOTSession} from 'nativescript-opentok';

export class OpenTokDemo extends Observable {

    private session: any;

    constructor() {
        super();
        this.session = new TNSOTSession('45628212');
        this.session.create(this.getSessionID()).then((result) => {
            this.session.connect(this.getToken()).then((result) => {
                this.session.publish(300, 300, 450, 450);
            }, (err) => {
                console.log('Error connecting');
            });
            console.log('SessionEvents(NS): ' + this.session.instance().sessionEvents);
        }, (err) => {});
        // this.session.instance().sessionEvents.on('sessionDidConnect',  (eventData) => {
        //     console.log('sessionDidConnect', eventData);
        // });
        // this.session.publisher().instance().publisherEvents.on('didChangeCameraPosition', (eventData) => {
        //     console.log('didChangeCameraPosition', eventData);
        // });

    }

    togglePublisherVideo() {
        this.session.publisher().toggleVideo().then((result) => {
            console.log('Set video stream state to: ' + result);
        }, (error) => {
            console.log('Error toggling video stream state: ' + error);
        });;
    }

    togglePublisherAudio() {
        this.session.publisher().toggleAudio();
    }

    togglePublisherCamera() {
        this.session.publisher().toggleCameraPosition();
    }

    private getSessionID() {
        return '1_MX40NTYyODIxMn5-MTQ2OTY0NjU3OTA2NX5aSjVYVndXREx4QUY3QjJOTGt1RGxDS0Z-fg';
    }

    private getToken() {
        return 'T1==cGFydG5lcl9pZD00NTYyODIxMiZzaWc9ZTFlM2Q4MjYxZDI4ZDQzZjBhYWEzYzlkOGIxZGI1Mjg3YTY1NGE0ODpzZXNzaW9uX2lkPTFfTVg0ME5UWXlPREl4TW41LU1UUTJPVFkwTmpVM09UQTJOWDVhU2pWWVZuZFhSRXg0UVVZM1FqSk9UR3QxUkd4RFMwWi1mZyZjcmVhdGVfdGltZT0xNDY5NjQ2NTk5Jm5vbmNlPTAuMzQyMTI5NjI2MDc4NTMxMTUmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ3MjIzODU5OQ==';
    }

}