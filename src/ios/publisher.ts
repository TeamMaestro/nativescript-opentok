import {Observable} from 'data/observable';
import {topmost} from 'ui/frame';
import {TNSOTPublisherI} from '../common';

declare var OTPublisher: any,
            CGRectMake: any,
            OTPublisherKitDelegate: any,
            AVCaptureDevicePositionBack: any,
            AVCaptureDevicePositionFront: any;

export class TNSOTPublisher implements TNSOTPublisherI {

    private _publisherDelegate;
    private _publisherEvents: Observable;

    public nativePublisher: any;

    constructor() {
        this._publisherEvents = new Observable();
        this.registerPublisherDelegate();
    }

    publish(session: any, videoLocationX: number = 0, videoLocationY: number = 0, videoWidth: number = 100, videoHeight: number = 100) {
        this.nativePublisher = OTPublisher.alloc().initWithDelegate(this._publisherDelegate);
        this.nativePublisher.publishAudio = true;
        try {
            session.publish(this.nativePublisher);
        } catch (error) {
            console.log(error);
        }
        if (this.nativePublisher) {
            topmost().currentPage.ios.view.addSubview(this.nativePublisher.view)
            this.nativePublisher.view.frame = CGRectMake(videoLocationX, videoLocationY, videoWidth, videoHeight);
        }
    }

    /**
     * Cleans up the publisher and its view. At this point, the publisher should not
     * be attached to the session any more.
     */
	cleanup() {
        let publisher = this.nativePublisher;
        if(publisher) {
            publisher.view.removeFromSuperview();
            publisher = null;
            this._publisherEvents.notify({
                eventName: 'didStopPublishing',
                object: null
            });
        }
    }

    /**
     * Toggles the visibility state of the publisher video stream
     *
     * @returns {Promise<any>}
     */
    toggleVideo() {
        let publisher = this.nativePublisher;
        if(publisher) {
            publisher.publishVideo = !publisher.publishVideo;
        }
    }

    /**
     * Toggles the mute state of the publisher audio stream
     *
     * @returns {Promise<any>}
     */
    toggleAudio() {
        let publisher = this.nativePublisher;
        if(publisher) {
            publisher.publishAudio = !publisher.publishAudio;
        }
    }

    /**
     * Sets the visibility state of the publisher video stream
     *
     * @param {boolean} state The visibility state, {true} visible, {false} hidden
     */
    setVideoActive(state: boolean) {
        let publisher = this.nativePublisher;
        if(publisher) {
            publisher.publishVideo = state;
        }
    }

    /**
     * Sets the mute state of the publisher audio stream
     *
     * @param {boolean} state The mute state, {true} not muted, {false} muted
     */
    setAudioActive(state: boolean) {
        let publisher = this.nativePublisher;
        if(publisher) {
            publisher.publishAudio = state;
        }
    }

    /**
     * Toggles the camera used to publish the video stream
     */
    toggleCameraPosition() {
        let publisher = this.nativePublisher;
        if(publisher) {
            if(publisher.cameraPosition === AVCaptureDevicePositionBack) {
                publisher.cameraPosition = AVCaptureDevicePositionFront;
            }
            else {
                publisher.cameraPosition = AVCaptureDevicePositionBack;
            }
        }
    }

    get publisherEvents(): Observable {
        return this._publisherEvents;
    }

    /**
     * The streaming state of the publisher's audio stream
     *
     * @readonly
     * @type {boolean} Whether the audio stream is active
     */
    get publishAudio(): boolean {
        let publisher = this.nativePublisher;
        return publisher.publishAudio;
    }

    /**
     * The streaming state of the publisher's video stream
     *
     * @readonly
     * @type {boolean} Whether the video stream is active
     */
    get publishVideo(): boolean {
        let publisher = this.nativePublisher;
        return publisher.publishVideo;
    }

    private registerPublisherDelegate() {
        this._publisherDelegate = NSObject.extend({
            didChangeCameraPosition(publisher: any, position: any) {
                this._publisherEvents.notify({
                    eventName: 'didChangeCameraPosition',
                    object: new Observable({
                        publisher: publisher,
                        position: position
                    })
                });
            },
            streamCreated(publisher: any, stream: any) {
                this._publisherEvents.notify({
                    eventName: 'streamCreated',
                    object: new Observable({
                        publisher: publisher,
                        stream: stream
                    })
                });
            },
            streamDestroyed(publisher: any, stream: any) {
                this._publisherEvents.notify({
                    eventName: 'streamDestroyed',
                    object: new Observable({
                        publisher: publisher,
                        stream: stream
                    })
                });
            },
            didFailWithError(publisher: any, error: any) {
                this._publisherEvents.notify({
                    eventName: 'didFailWithError',
                    object: new Observable({
                        publisher: publisher,
                        error: error
                    })
                });
            }
        }, {
            protocols: [OTPublisherKitDelegate]
        });
    }

}