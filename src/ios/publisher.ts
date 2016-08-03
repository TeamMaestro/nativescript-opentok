import {topmost} from 'ui/frame';
import {TNSOTPublisherDelegate} from './publisher-delegate';
import {TNSOTPublisherI} from '../common';

declare var OTPublisher: any,
            CGRectMake: any,
            AVCaptureDevicePositionBack: any,
            AVCaptureDevicePositionFront: any;

export class TNSOTPublisher implements TNSOTPublisherI {

    public nativePublisher: any;
    private _delegate: any;

    constructor(emitEvents?: boolean) {
        this._delegate = new TNSOTPublisherDelegate();
        this._delegate.initPublisher(emitEvents);
    }

    init(session: any, videoLocationX: number = 0, videoLocationY: number = 0, videoWidth: number = 100, videoHeight: number = 100): Promise<any> {
        return new Promise((resolve, reject) => {
            if (session) {
                this.nativePublisher = new OTPublisher(this._delegate);
                this.nativePublisher.publishAudio = true;
                try {
                    session.publish(this.nativePublisher);
                } catch (error) {
                    reject(error);
                }
                if (this.nativePublisher) {
                    topmost().currentPage.ios.view.addSubview(this.nativePublisher.view)
                    this.nativePublisher.view.frame = CGRectMake(videoLocationX, videoLocationY, videoWidth, videoHeight);
                }
                resolve(this.nativePublisher);
            }
        });
    }

    /**
     * Toggles the visibility state of the publisher video stream
     *
     * @returns {Promise<any>}
     */
    toggleVideo(): Promise<any> {
        return new Promise((resolve, reject) => {
            let publisher = this.nativePublisher;
            if(publisher) {
                publisher.publishVideo = !publisher.publishVideo;
                resolve(publisher.publishVideo);
            }
            else {
                reject('Publisher not defined');
            }
        });
    }

    /**
     * Toggles the mute state of the publisher audio stream
     *
     * @returns {Promise<any>}
     */
    toggleAudio(): Promise<any> {
        return new Promise((resolve, reject) => {
            let publisher = this.nativePublisher;
            if(publisher) {
                publisher.publishAudio = !publisher.publishAudio;
                resolve(publisher.publishAudio);
            }
            else {
                reject('Publisher not defined');
            }
        });
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
    toggleCameraPosition(){
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

    instance(): any {
        return this._delegate;
    }



}