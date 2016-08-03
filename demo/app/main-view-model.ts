///<reference path="../node_modules/nativescript-opentok/opentok.ios.d.ts"/>

import {Observable} from 'data/observable';

import { TNSOTSession} from 'nativescript-opentok';

export class OpenTokDemo extends Observable {

    private session: any;

    constructor() {
        super();
        this.session = new TNSOTSession('45628212');
        this.session.create(this.getSessionID());
        // this.session.instance().sessionEvents.on('sessionDidConnect',  (eventData) => {
        //     console.log('sessionDidConnect', eventData);
        // });
        // this.session.publisher.instance().publisherEvents.on('didChangeCameraPosition', (eventData) => {
        //     console.log('didChangeCameraPosition', eventData);
        // });

    }

    initPublisher() {
        this.session.connect(this.getPublisherToken()).then((result) => {
            this.session.publish(75, 200, 250, 250).then(() => {
            //     // this.session.subscribe(this.session.publisher.nativePublisher.stream);
            });
        }, (err) => {
            console.log('Publisher Error: ' + err);
        });
    }

    initSubscriber() {
        this.session.connect(this.getSubscriberToken()).then((result) => {
            // this.session.publish(75, 200, 250, 250).then(() => {
            //     // this.session.subscribe(this.session.publisher.nativePublisher.stream);
            // });
        }, (err) => {
            console.log('Subscriber Error: ' + err.message);
        });
    }

    togglePublisherVideo() {
        this.session.publisher.toggleVideo().then((result) => {
            console.log('Set video stream state to: ' + result);
        }, (error) => {
            console.log('Error toggling video stream state: ' + error);
        });;
    }

    togglePublisherAudio() {
        this.session.publisher.toggleAudio();
    }

    togglePublisherCamera() {
        this.session.publisher.toggleCameraPosition();
    }

    private getSessionID() {
        return '1_MX40NTYyODIxMn5-MTQ3MDI1MjI2MDEzNH5oMUo4VlliUWpQYTFLSVJZV0ZPN0RESGh-UH4';
    }

    private getToken() {
        return 'T1==cGFydG5lcl9pZD00NTYyODIxMiZzaWc9ZTFlM2Q4MjYxZDI4ZDQzZjBhYWEzYzlkOGIxZGI1Mjg3YTY1NGE0ODpzZXNzaW9uX2lkPTFfTVg0ME5UWXlPREl4TW41LU1UUTJPVFkwTmpVM09UQTJOWDVhU2pWWVZuZFhSRXg0UVVZM1FqSk9UR3QxUkd4RFMwWi1mZyZjcmVhdGVfdGltZT0xNDY5NjQ2NTk5Jm5vbmNlPTAuMzQyMTI5NjI2MDc4NTMxMTUmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ3MjIzODU5OQ==';
    }

    private getPublisherToken() {
        return  'T1==cGFydG5lcl9pZD00NTYyODIxMiZzaWc9ZDI1ZjRmNmViNDZjYmFiYzc5YTIwYTcxYjA2NzJhNDllNmZhMmJkYzpzZXNzaW9uX2lkPTFfTVg0ME5UWXlPREl4TW41LU1UUTNNREkxTWpJMk1ERXpOSDVvTVVvNFZsbGlVV3BRWVRGTFNWSlpWMFpQTjBSRVNHaC1VSDQmY3JlYXRlX3RpbWU9MTQ3MDI1MjI4OCZub25jZT0wLjUzNjkzMjI0Njc1OTUzMzkmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ3Mjg0NDI4Nw==';
    }

    private getSubscriberToken() {
        return 'T1==cGFydG5lcl9pZD00NTYyODIxMiZzaWc9YjY0ZDNhYTRmZWU3YzExYWM5MWY1MjIyZTc5ZGQ3NTNlNTlkMTMxMzpzZXNzaW9uX2lkPTFfTVg0ME5UWXlPREl4TW41LU1UUTNNREkxTWpJMk1ERXpOSDVvTVVvNFZsbGlVV3BRWVRGTFNWSlpWMFpQTjBSRVNHaC1VSDQmY3JlYXRlX3RpbWU9MTQ3MDI1MjMzMSZub25jZT0wLjA0MjY4NTM2NjIzNTY3MzQzJnJvbGU9c3Vic2NyaWJlciZleHBpcmVfdGltZT0xNDcyODQ0MzMx';
    }



}