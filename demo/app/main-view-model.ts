import * as frame from 'ui/frame';
import {Observable, EventData} from 'data/observable';
import {isAndroid, isIOS} from 'platform';
import {Page} from 'ui/page';

import {TNSOTPublisher} from 'nativescript-opentok';

export class Demo extends Observable {

    public api:string = '45644202';
    public sessionId: string = '1_MX40NTY0NDIwMn5-MTQ3MjIyNzU3NTAwM35FczFWMHdVekNxeXNabWRSTUdIUkpjRmR-fg';
    public publisherToken: string = 'T1==cGFydG5lcl9pZD00NTY0NDIwMiZzaWc9NTkwNmVhZWZjNDMzNWRlNDY5ZTZmZTkwMjg0Yjk0ODJlZmE4NjFjODpzZXNzaW9uX2lkPTFfTVg0ME5UWTBOREl3TW41LU1UUTNNakl5TnpVM05UQXdNMzVGY3pGV01IZFZla054ZVhOYWJXUlNUVWRJVWtwalJtUi1mZyZjcmVhdGVfdGltZT0xNDcyMjI3NTg4Jm5vbmNlPTAuNzY3MTczMTA0Njg2NjYyNiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDc0ODE5NTg3';
    public publisherToken2: string = 'T1==cGFydG5lcl9pZD00NTY0NDIwMiZzaWc9YTM5NTVmODVmYWU0NjkwNThiN2YzMjU3YzM0ZmI4YTYwNTg2YjU0MjpzZXNzaW9uX2lkPTFfTVg0ME5UWTBOREl3TW41LU1UUTNNakl5TnpVM05UQXdNMzVGY3pGV01IZFZla054ZVhOYWJXUlNUVWRJVWtwalJtUi1mZyZjcmVhdGVfdGltZT0xNDcyMjQyNDgwJm5vbmNlPTAuMjU5ODA5NDU5MzI2Nzg4OCZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDc0ODM0NDgw';

    private publisher: any;

    constructor(private page: Page) {
        super();
        this.publisher = this.page.getViewById('publisher');
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

}