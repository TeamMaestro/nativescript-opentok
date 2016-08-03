import {Observable, EventData} from 'data/observable';
import {topmost} from 'ui/frame';

declare var OTPublisherDelegate: any;

export class TNSOTPublisherDelegate extends NSObject {

    public static ObjCProtocols = [OTPublisherDelegate];

    private didChangeCameraPositionEvent: EventData;
    private streamCreatedEvent: EventData;
    private streamDestroyedEvent: EventData;
    private didFailWithErrorEvent: EventData;

    public publisherEvents: Observable;

    initPublisher(emitEvents?: boolean) {
        if(emitEvents) {
            this.setupEvents();
        }
    }

    /**
     * Sent when the camera device is changed.
     *
     * @param {*} publisher The publisher that signalled this event.
     * @param {*} position The position of the new camera.
     */
    didChangeCameraPosition(publisher: any, position: any) {
        if(this.publisherEvents) {
            this.publisherEvents.notify(this.didChangeCameraPositionEvent);
        }
    }

    /**
     * Sent when the publisher starts streaming.
     *
     * @param {*} publisher The publisher of the stream.
     * @param {*} stream The stream that was created.
     */
    streamCreated(publisher: any, stream: any) {
        console.log('publisher stream created');
        if(this.publisherEvents) {
            this.publisherEvents.notify(this.streamCreatedEvent);
        }
    }

    /**
     * Sent when the publisher stops streaming.
     *
     * @param {*} publisher The publisher that stopped sending this stream.
     * @param {*} stream The stream that ended.
     */
    streamDestroyed(publisher: any, stream: any) {
        if(this.publisherEvents) {
            this.publisherEvents.notify(this.streamCreatedEvent);
        }
    }

    /**
     * Sent if the publisher encounters an error. After this message is sent, the publisher can be considered fully detached from a session and may be released.
     *
     * @param {*} publisher The publisher that signalled this event.
     * @param {*} error The error (an OTError object). The OTPublisherErrorCode enum (defined in the OTError class) defines values for the code property of this object.
     */
    didFailWithError(publisher: any, error: any) {
        console.log('did fail');
        if(this.publisherEvents) {
            this.publisherEvents.notify(this.didFailWithErrorEvent);
        }
    }

    /**
     * Sets up the event data objects for hooking into OTSessionDelegate events
     *
     * @private
     */
    private setupEvents() {
        this.publisherEvents = new Observable();
        // OTPublisherKitDelegate Events
        this.streamCreatedEvent = {
            eventName: 'streamCreated',
            object: topmost().currentPage.ios
        };
        this.streamDestroyedEvent = {
            eventName: 'streamDestroyed',
            object: topmost().currentPage.ios
        };
        this.didFailWithErrorEvent = {
            eventName: 'didFailWithError',
            object: topmost().currentPage.ios
        };
        // OTPublisherDelegate Events
        this.didChangeCameraPositionEvent = {
            eventName: 'didChangeCameraPosition',
            object: topmost().currentPage.ios
        };
    }

}
