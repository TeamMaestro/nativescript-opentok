import {Observable, EventData} from 'data/observable';
import {topmost} from 'ui/frame';

declare var OTPublisherDelegate: any;

export class TNSOTPublisherDelegate extends NSObject implements OTPublisherDelegate {

    public static ObjCProtocols = [OTPublisherDelegate];

    public publisherEvents: Observable;

    private _didChangeCameraPosition: EventData;

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
    publisherDidChangeCameraPosition(publisher: any, position: any) {
        if(this.publisherEvents) {
            this.publisherEvents.notify(this._didChangeCameraPosition);
        }
    }

    /**
     * Sets up the event data objects for hooking into OTSessionDelegate events
     *
     * @private
     */
    private setupEvents() {
        this.publisherEvents = new Observable();
        this._didChangeCameraPosition = {
            eventName: 'didChangeCameraPosition',
            object: topmost().currentPage.ios
        };
    }

}
