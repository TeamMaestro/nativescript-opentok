///<reference path="../node_modules/nativescript-opentok/opentok.ios.d.ts"/>

import {Observable} from 'data/observable';

import { TNSOTSession} from 'nativescript-opentok';

export class OpenTokDemo extends Observable {

    private session: any;

    constructor() {
        super();
        this.session = new TNSOTSession('45628212');
        this.session.create(this.sessionId);
    }

    initPublisher() {
        this.session.connect(this.publisherToken).then((result) => {
            this.session.publish(75, 200, 250, 250);
        }, (err) => {
            console.log('Publisher Error: ' + err.message);
        });
    }

    initSubscriber() {
        this.session.connect(this.subscriberToken).then((result) => {}, (err) => {
            console.log('Subscriber Error: ' + err.message);
        });
        this.session.sessionEvents.on('sessionDidConnect', (result) => {
            console.log('[OpenTok] Session connected with id: ' + JSON.stringify(result.object));
        });
    }

    togglePublisherVideo() {
        this.session.publisher.toggleVideo();
    }

    togglePublisherAudio() {
        this.session.publisher.toggleAudio();
    }

    togglePublisherCamera() {
        this.session.publisher.toggleCameraPosition();
    }

    private get sessionId(): string {
        return '1_MX40NTYyODIxMn5-MTQ3MDI1MjI2MDEzNH5oMUo4VlliUWpQYTFLSVJZV0ZPN0RESGh-UH4';
    }

    private get publisherToken(): string {
        return  'T1==cGFydG5lcl9pZD00NTYyODIxMiZzaWc9ZDI1ZjRmNmViNDZjYmFiYzc5YTIwYTcxYjA2NzJhNDllNmZhMmJkYzpzZXNzaW9uX2lkPTFfTVg0ME5UWXlPREl4TW41LU1UUTNNREkxTWpJMk1ERXpOSDVvTVVvNFZsbGlVV3BRWVRGTFNWSlpWMFpQTjBSRVNHaC1VSDQmY3JlYXRlX3RpbWU9MTQ3MDI1MjI4OCZub25jZT0wLjUzNjkzMjI0Njc1OTUzMzkmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ3Mjg0NDI4Nw==';
    }

    private get subscriberToken(): string {
        return 'T1==cGFydG5lcl9pZD00NTYyODIxMiZzaWc9YjY0ZDNhYTRmZWU3YzExYWM5MWY1MjIyZTc5ZGQ3NTNlNTlkMTMxMzpzZXNzaW9uX2lkPTFfTVg0ME5UWXlPREl4TW41LU1UUTNNREkxTWpJMk1ERXpOSDVvTVVvNFZsbGlVV3BRWVRGTFNWSlpWMFpQTjBSRVNHaC1VSDQmY3JlYXRlX3RpbWU9MTQ3MDI1MjMzMSZub25jZT0wLjA0MjY4NTM2NjIzNTY3MzQzJnJvbGU9c3Vic2NyaWJlciZleHBpcmVfdGltZT0xNDcyODQ0MzMx';
    }

}