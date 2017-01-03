import * as frame from 'ui/frame';
import {Observable, EventData} from 'data/observable';
import {isAndroid, isIOS} from 'platform';
import {Page} from 'ui/page';

import {TNSOTSession, TNSOTPublisher, TNSOTSubscriber} from 'nativescript-opentok';

export class Demo extends Observable {

    public _apiKey:string = '45743242';
    private _sessionId: string = '1_MX40NTc0MzI0Mn5-MTQ4MzQwMzM1NzM5N34rUTZFS1JSY0E0Z3hXMXhlYlZYblk5amh-fg';
    private _publisherToken: string = 'T1==cGFydG5lcl9pZD00NTc0MzI0MiZzaWc9Y2VkNjE3YmM4NzA0ZWY0M2FjOGNjOWNlMGM3ZWI0MGRjZDI4OWQ1YzpzZXNzaW9uX2lkPTFfTVg0ME5UYzBNekkwTW41LU1UUTRNelF3TXpNMU56TTVOMzRyVVRaRlMxSlNZMEUwWjNoWE1YaGxZbFpZYmxrNWFtaC1mZyZjcmVhdGVfdGltZT0xNDgzNDAzMzY1Jm5vbmNlPTAuMTM1MzI5MjkzNzEwNzEzNTYmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ4NTk5NTM2Ng==';

    private publisher: TNSOTPublisher;
    private subscriber: TNSOTSubscriber;

    private session: TNSOTSession;

    constructor(private page: Page) {
        super();
        this.session = TNSOTSession.initWithApiKeySessionId(this._apiKey, this._sessionId);
        this.publisher = <TNSOTPublisher> this.page.getViewById('publisher');
        this.subscriber = <TNSOTSubscriber> this.page.getViewById('subscriber');
        this.session.subscriber = this.subscriber;
        this.session.connect(this._publisherToken);
    }

    publish() {
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