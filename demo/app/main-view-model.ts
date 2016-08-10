///<reference path="../node_modules/nativescript-opentok/opentok.ios.d.ts"/>

import {Observable} from 'data/observable';

import { TNSOTSession} from 'nativescript-opentok';

export class OpenTokDemo extends Observable {

    private _apiKey: string = '45628212';
    private _session: any;

    constructor() {
        super();
        this._session = new TNSOTSession(this._apiKey, {
            publisher: {
                videoLocationX: 240,
                videoLocationY: 200,
                videoWidth: 250,
                videoHeight: 250
            },
            subscriber: {
                videoLocationX: 800,
                videoLocationY: 200,
                videoWidth: 120,
                videoHeight: 120
            }
        });
        this._session.initSession(this.sessionId);
    }

    initPublisher() {
        this._session.connect(this.publisherToken);

        this._session.sessionEvents.on('sessionDidConnect', (result) => {
            console.log('sessionConnected event');
        });

        this._session.sessionEvents.on('connectionCreated', () => {
            console.log('connectionCreated Event');
        });

        this._session.sessionEvents.on('streamCreated', () => {
            console.log('streamCreated event on session object');
        });
    }

    initSubscriber() {
        this._session.connect(this.subscriberToken);

        this._session.sessionEvents.on('sessionDidConnect', (result) => {
            console.log('sessionConnected event');
            this._session.publish();
            this._session.publisherEvents.on('streamCreated', () => {
                console.log('streamCreated event on publisher object');
            });
        });

    }

    togglePublisherVideo() {
        this._session.publisher.toggleVideo();
    }

    togglePublisherAudio() {
        this._session.publisher.toggleAudio();
    }

    togglePublisherCamera() {
        this._session.publisher.toggleCameraPosition();
    }

    private get sessionId(): string {
        return '1_MX40NTYyODIxMn5-MTQ3MDI1MjI2MDEzNH5oMUo4VlliUWpQYTFLSVJZV0ZPN0RESGh-UH4';
    }

    private get publisherToken(): string {
        return  'T1==cGFydG5lcl9pZD00NTYyODIxMiZzaWc9ZDI1ZjRmNmViNDZjYmFiYzc5YTIwYTcxYjA2NzJhNDllNmZhMmJkYzpzZXNzaW9uX2lkPTFfTVg0ME5UWXlPREl4TW41LU1UUTNNREkxTWpJMk1ERXpOSDVvTVVvNFZsbGlVV3BRWVRGTFNWSlpWMFpQTjBSRVNHaC1VSDQmY3JlYXRlX3RpbWU9MTQ3MDI1MjI4OCZub25jZT0wLjUzNjkzMjI0Njc1OTUzMzkmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ3Mjg0NDI4Nw==';
    }

    private get subscriberToken(): string {
        // return 'T1==cGFydG5lcl9pZD00NTYyODIxMiZzaWc9YjY0ZDNhYTRmZWU3YzExYWM5MWY1MjIyZTc5ZGQ3NTNlNTlkMTMxMzpzZXNzaW9uX2lkPTFfTVg0ME5UWXlPREl4TW41LU1UUTNNREkxTWpJMk1ERXpOSDVvTVVvNFZsbGlVV3BRWVRGTFNWSlpWMFpQTjBSRVNHaC1VSDQmY3JlYXRlX3RpbWU9MTQ3MDI1MjMzMSZub25jZT0wLjA0MjY4NTM2NjIzNTY3MzQzJnJvbGU9c3Vic2NyaWJlciZleHBpcmVfdGltZT0xNDcyODQ0MzMx';
        return 'T1==cGFydG5lcl9pZD00NTYyODIxMiZzaWc9OWJlZTkzNDZlMmU1ZjhiMDk5OTM5NzgzMWZmNTIzYjUxNjY0N2NiMDpzZXNzaW9uX2lkPTFfTVg0ME5UWXlPREl4TW41LU1UUTNNREkxTWpJMk1ERXpOSDVvTVVvNFZsbGlVV3BRWVRGTFNWSlpWMFpQTjBSRVNHaC1VSDQmY3JlYXRlX3RpbWU9MTQ3MDg1NTk2OCZub25jZT0wLjgwMTA4ODI2MTg4MzcwNTkmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ3MzQ0Nzk2OA==';
    }

}