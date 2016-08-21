///<reference path="../node_modules/nativescript-opentok/opentok.ios.d.ts"/>

import {Observable} from 'data/observable';
import * as opentok from './opentok/opentok';

export class OpenTokDemo extends Observable {

    private _apiKey: string = '45638092';
    private _session: any;
    session;

    constructor() {
        super();
        this._session = new opentok.TNSOTSession(this._apiKey);
        this._session.initSession(this.sessionId);
    }

    initPublisher() {
        this._session.connect(this.publisherToken)
            .then((cb) => {

            }, (e) => {
                console.dump(e)
            });

        this._session.sessionEvents.on('sessionDidDisconnect', (result) => {
            console.log('sessionDidDisconnect event');
        });
        this._session.sessionEvents.on('sessionDidConnect', (result) => {
            console.log('sessionConnected event');
        });

        this._session.sessionEvents.on('sessionDidBeginReconnecting', (result) => {
            console.log('sessionDidBeginReconnecting event');
        });


        this._session.sessionEvents.on('sessionDidReconnect', (result) => {
            console.log('sessionDidReconnect event');
        });
        this._session.sessionEvents.on('connectionCreated', () => {
            console.log('connectionCreated Event');
        });

        this._session.sessionEvents.on('streamCreated', () => {
            console.log('streamCreated event on session object');
        });

        this._session.sessionEvents.on('didFailWithError', (session, error) => {
            console.dump(error)
        })
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
        return '2_MX40NTYzODA5Mn5-MTQ3MTM4NDg4NDIzNH5uTXFlTHhnWGRSRFE2WTRjMkxMN3BHcG9-fg';
    }

    private get publisherToken(): string {
        return 'T1==cGFydG5lcl9pZD00NTYzODA5MiZzaWc9ZWZmYTU2NjdmOGQ0YzdlOWNlZWFkY2Y1MjkxMzJiNGExMzAxOTEzOTpzZXNzaW9uX2lkPTJfTVg0ME5UWXpPREE1TW41LU1UUTNNVE00TkRnNE5ESXpOSDV1VFhGbFRIaG5XR1JTUkZFMldUUmpNa3hNTjNCSGNHOS1mZyZjcmVhdGVfdGltZT0xNDcxNDkxMjAwJm5vbmNlPTAuMTY4NDU0NDczODM4MjEwMSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDc0MDgzMTk1';
    }

    private get subscriberToken(): string {
        return 'T1==cGFydG5lcl9pZD00NTYzODA5MiZzaWc9YjZjM2JiMTMzNTI0ZDFhMTY5MWNjZmZmYjQ4ZWU0MjcxNDM5ZmMzYTpzZXNzaW9uX2lkPTJfTVg0ME5UWXpPREE1TW41LU1UUTNNVE00TkRnNE5ESXpOSDV1VFhGbFRIaG5XR1JTUkZFMldUUmpNa3hNTjNCSGNHOS1mZyZjcmVhdGVfdGltZT0xNDcxNDkxMjE4Jm5vbmNlPTAuOTgxNTUwMjM1NTM0MDg2OCZyb2xlPXN1YnNjcmliZXImZXhwaXJlX3RpbWU9MTQ3NDA4MzIxNA==';
    }

}