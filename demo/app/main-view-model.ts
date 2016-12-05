import * as frame from 'ui/frame';
import {Observable, EventData} from 'data/observable';
import {isAndroid, isIOS} from 'platform';
import {Page} from 'ui/page';

import {TNSOTSession, TNSOTPublisher, TNSOTSubscriber} from 'nativescript-opentok';

export class Demo extends Observable {

    public _apiKey:string = '45720082';
    private _sessionId: string = '1_MX40NTcyMDA4Mn5-MTQ3OTQwMDk0NDcyN35XdmdkZjlnazN2UytPYk1mNW1aWVZSZmh-fg';
    private _publisherToken: string = 'T1==cGFydG5lcl9pZD00NTcyMDA4MiZzaWc9YjUxN2NlZmU0MjEyYjU4YTcxMzY0MWU5M2JkZTYyOTIyY2E4OTNhNTpzZXNzaW9uX2lkPTFfTVg0ME5UY3lNREE0TW41LU1UUTNPVFF3TURrME5EY3lOMzVYZG1ka1pqbG5hek4yVXl0UFlrMW1OVzFhV1ZaU1ptaC1mZyZjcmVhdGVfdGltZT0xNDc5NDAwOTU1Jm5vbmNlPTAuOTAzNTUwODk1ODE3Mzk4MyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDgxOTkyOTU0';

    private publisher: TNSOTPublisher;
    private subscriber: TNSOTSubscriber;

    private session: TNSOTSession;

    constructor(private page: Page) {
        super();
        this.session = TNSOTSession.initWithApiKeySessionId(this._apiKey, this._sessionId);
        this.publisher = <TNSOTPublisher> this.page.getViewById('publisher');
        this.subscriber = <TNSOTSubscriber> this.page.getViewById('subscriber');
        this.session.subscriber = this.subscriber;
    }

    publish() {
        this.session.connect(this._publisherToken);
        this.publisher.publish(this.session, '', 'HIGH', '30');
    }

    switchCamera() {
        this.publisher.cycleCamera();
    }

    toggleVideo() {
        this.publisher.toggleCamera()
    }

    toggleMute() {
        this.publisher.toggleMute();
    }

    unpublish() {
        this.publisher.unpublish(this.session);
    }

    unsubscribe() {
        this.subscriber.unsubscribe(this.session);
    }

    disconnect() {
        this.session.disconnect();
    }

}