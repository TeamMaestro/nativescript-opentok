import * as frame from 'ui/frame';
import {Observable, EventData} from 'data/observable';
import {isAndroid, isIOS} from 'platform';

import {TNSOTPublisher} from 'nativescript-opentok';

export class Demo extends Observable {

    // private _apiKey: string = '45628212';
    // private _OTSession: any;

    public api:string = '45628212';
    public session: string = '1_MX40NTYyODIxMn5-MTQ3MTkwNTg1OTQ3MH5WMHk3QlljcE1IVjJ6a1FXRVpWenRoa1p-fg';
    public token: string = 'T1==cGFydG5lcl9pZD00NTYyODIxMiZzaWc9MWNiMWM0N2Q4ZTkyY2IyY2Y5MDU2YzRiMTk5NzcxN2E1NjczYmM4NzpzZXNzaW9uX2lkPTFfTVg0ME5UWXlPREl4TW41LU1UUTNNVGt3TlRnMU9UUTNNSDVXTUhrM1FsbGpjRTFJVmpKNmExRlhSVnBXZW5Sb2ExcC1mZyZjcmVhdGVfdGltZT0xNDcxOTA1ODc4Jm5vbmNlPTAuODc4ODQ5Nzg2MDA3Nzc2OSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDc0NDk3ODc4';


    constructor() {
        super();
        // this._OTSession = new TNSOTSession(this._apiKey);
        // this._OTSession.initSession(this.sessionId);
    }

    initPublisher() {
        // let page = frame.topmost().currentPage;
        // let publisher = <TNSOTPublisher> page.getViewById('otPublisher');

        // this._session.sessionEvents.on('sessionDidConnect', (result) => {
        //     console.log('[demo] sessionConnected event');
        // });

        // this._session.sessionEvents.on('sessionDidBeginReconnecting', (result) => {
        //     console.log('[demo] sessionDidBeginReconnecting event');
        // });

        // this._session.sessionEvents.on('sessionDidReconnect', (result) => {
        //     console.log('[demo] sessionDidReconnect event');
        // });
        // this._session.sessionEvents.on('connectionCreated', () => {
        //     console.log('[demo] connectionCreated Event');
        // });

        // this._session.sessionEvents.on('streamCreated', () => {
        //     console.log('[demo] streamCreated event on session object');
        // });

        // this._session.sessionEvents.on('didFailWithError', (session, error) => {
        //     console.dump(error)
        // })
    }

    initSubscriber() {
        // this._OTSession.connect(this.subscriberToken);

        // this._OTSession.sessionEvents.on('sessionDidConnect', (result) => {
        //     console.log('[demo] sessionConnected event');
        //     this._OTSession.publish();
        //     this._OTSession.publisherEvents.on('streamCreated', () => {
        //         console.log('[demo] streamCreated event on publisher object');
        //     });
        // });

    }

    private get sessionId(): string {
        return '1_MX40NTYyODIxMn5-MTQ3MDI1MjI2MDEzNH5oMUo4VlliUWpQYTFLSVJZV0ZPN0RESGh-UH4';
    }

    private get publisherToken(): string {
        return  'T1==cGFydG5lcl9pZD00NTYyODIxMiZzaWc9ZDI1ZjRmNmViNDZjYmFiYzc5YTIwYTcxYjA2NzJhNDllNmZhMmJkYzpzZXNzaW9uX2lkPTFfTVg0ME5UWXlPREl4TW41LU1UUTNNREkxTWpJMk1ERXpOSDVvTVVvNFZsbGlVV3BRWVRGTFNWSlpWMFpQTjBSRVNHaC1VSDQmY3JlYXRlX3RpbWU9MTQ3MDI1MjI4OCZub25jZT0wLjUzNjkzMjI0Njc1OTUzMzkmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ3Mjg0NDI4Nw==';
    }

    private get subscriberToken(): string {
        return 'T1==cGFydG5lcl9pZD00NTYyODIxMiZzaWc9OWJlZTkzNDZlMmU1ZjhiMDk5OTM5NzgzMWZmNTIzYjUxNjY0N2NiMDpzZXNzaW9uX2lkPTFfTVg0ME5UWXlPREl4TW41LU1UUTNNREkxTWpJMk1ERXpOSDVvTVVvNFZsbGlVV3BRWVRGTFNWSlpWMFpQTjBSRVNHaC1VSDQmY3JlYXRlX3RpbWU9MTQ3MDg1NTk2OCZub25jZT0wLjgwMTA4ODI2MTg4MzcwNTkmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ3MzQ0Nzk2OA==';
    }

}