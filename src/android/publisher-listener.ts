import {Observable, EventData} from 'data/observable';
import * as app from 'application';

declare var com: any;
const CameraListener = com.opentok.android.Publisher.CameraListener;
const PublisherListener = com.opentok.android.PublisherKit.PublisherListener;

export class TNSPublisherListener {
    private _publisherEvents: Observable;
    private _cameraListener: any;
    private _publisherListener: any;
    initPublisherEvents(emitEvents: boolean = true) {
        if (emitEvents) {
            this._publisherEvents = new Observable();
            const that = new WeakRef(this);
            this._cameraListener = new CameraListener({
                owner: that.get(),
                onCameraChanged(publisher, newCameraId) {
                 //   this.owner._publishEvents.notify();
                 console.log("CameraChanged");
                 console.dump(newCameraId);
                }, onCameraError(publisher, error) {
                  //  this.owner._publishEvents.notify();
                  console.log("CameraError");
                  console.dump(error)
                }
            });
            this._publisherListener = new PublisherListener({
                owner: that.get(),
                onError(publisher: any, error: any) {
                    console.dump(error)
                    if (this.owner._publisherEvents) {
                        this.owner._publisherEvents.notify({
                            eventName: 'didFailWithError',
                            object: new Observable({
                                publisher: publisher,
                                error: error
                            })
                        });
                    }
                },
                onStreamCreated(publisher: any, stream: any) {
                    if (this.owner._publisherEvents) {
                        this.owner._publisherEvents.notify({
                            eventName: 'streamCreated',
                            object: new Observable({
                                publisher: publisher,
                                stream: stream
                            })
                        });
                    }
                },
                onStreamDestroyed(publisher: any, stream: any) {
                    if (this.owner._publisherEvents) {
                        this.owner._publisherEvents.notify({
                            eventName: 'streamDestroyed',
                            object: new Observable({
                                publisher: publisher,
                                stream: stream
                            })
                        });
                    }
                }
            })

        }
    }

    get cameraListener() {
        return this._cameraListener;
    }
    get publisherListener() {
        return this._publisherListener;
    }

    /*didChangeCameraPosition(publisher: any, position: any) {
        if (this._publisherEvents) {
            this._publisherEvents.notify({
                eventName: 'didChangeCameraPosition',
                object: new Observable({
                    publisher: publisher,
                    position: position
                })
            });
        }
    }*/

    get publisherEvents(): Observable {
        return this._publisherEvents;
    }

}