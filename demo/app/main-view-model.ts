import * as frame from 'ui/frame';
import {Observable, EventData} from 'data/observable';
import {isAndroid, isIOS} from 'platform';
import {Page} from 'ui/page';

import {TNSOTSession, TNSOTPublisher} from 'nativescript-opentok';

export class Demo extends Observable {

    public _apiKey:string = '45644202';
    private _sessionId: string = '1_MX40NTY0NDIwMn5-MTQ3MjIyNzU3NTAwM35FczFWMHdVekNxeXNabWRSTUdIUkpjRmR-fg';
    private _publisherToken: string = 'T1==cGFydG5lcl9pZD00NTY0NDIwMiZzaWc9ODMwYzUyMTEwMjk5ODQ1OGQ3YmJlOWY1MDFhOGU2MGQwZGQyMmQyYjpzZXNzaW9uX2lkPTFfTVg0ME5UWTBOREl3TW41LU1UUTNNakl5TnpVM05UQXdNMzVGY3pGV01IZFZla054ZVhOYWJXUlNUVWRJVWtwalJtUi1mZyZjcmVhdGVfdGltZT0xNDcyODQ4NDk1Jm5vbmNlPTAuNjYyMzAzOTA2MTY2OTI2JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE0NzU0NDA0OTU=';

    private publisher: TNSOTPublisher;
    private session: TNSOTSession;

    constructor(private page: Page) {
        super();
        this.session = TNSOTSession.initWithApiKeySessionId(this._apiKey, this._sessionId);
        this.publisher = <TNSOTPublisher> this.page.getViewById('publisher');
        this.initPublisher();
    }

    initPublisher() {
        this.session.connect(this._publisherToken);
        this.publisher.publish(this.session, '', 'HIGH', '30');
        this.publisher.events.on('streamDestroyed', (result) => {
            console.log('publisher stream destroyed');
        });
    }

    switchCamera() {
        this.publisher.cycleCamera();
    }

    toggleVideo() {
        this.publisher.ios.publishVideo = !this.publisher.ios.publishVideo;
    }

    toggleMute() {
        this.publisher.ios.publishAudio = !this.publisher.ios.publishAudio;
    }

    unpublish() {
        this.publisher.unpublish(this.session);
    }

}