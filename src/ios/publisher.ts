import {Observable} from 'data/observable';
import {topmost} from 'ui/frame';
import {screen} from 'platform';
import {ContentView} from 'ui/content-view'
import {TNSOTSession} from './session';

declare var OTPublisher: any,
            CGRectMake: any,
            OTPublisherKitDelegate: any,
            OTCameraCaptureResolution: any,
            OTCameraCaptureFrameRate: any,
            AVCaptureDevicePositionBack: any,
            AVCaptureDevicePositionFront: any;

export class TNSOTPublisher extends ContentView {

    private _ios: any = {};
    private _publisherKitDelegate: any;

    constructor() {
        super();
        this._publisherKitDelegate = TNSPublisherKitDelegateImpl.initWithOwner(new WeakRef(this));
        this._ios = new OTPublisher(this._publisherKitDelegate);
    }

    publish(session: TNSOTSession, name?:string, cameraResolution?: string, cameraFrameRate?: string): void {
        this._ios = OTPublisher.alloc().initWithDelegateNameCameraResolutionCameraFrameRate(
            this._publisherKitDelegate,
            name ? name : '',
            this.getCameraResolution(cameraResolution),
            this.getCameraFrameRate(cameraFrameRate)
        );

        session.events.on('sessionDidConnect', (result) => {
            this._ios.publishAudio = true;
            try {
                let stream: any = result.object;
                stream.publish(this._ios);
            } catch(error) {
                console.log(error);
            }
        });
    }

    unpublish(session: TNSOTSession): void {
        try {
            if(session) {
                session._ios.unpublish(this._ios);
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    get ios(): any {
        return this._ios;
    }

    get _nativeView(): any {
        return this._ios.view;
    }

    private getCameraResolution(cameraResolution: string): any {
        if(cameraResolution) {
            switch(cameraResolution.toString().toUpperCase()) {
                case 'LOW':
                    return OTCameraCaptureResolution.OTCameraCaptureResolutionLow;
                case 'MEDIUM':
                    return OTCameraCaptureResolution.OTCameraCaptureResolutionMedium;
                case 'HIGH':
                    return OTCameraCaptureResolution.OTCameraCaptureResolutionHigh;
            }
        }
        return OTCameraCaptureResolution.OTCameraCaptureResolutionMedium;
    }

    private getCameraFrameRate(cameraFrameRate: string): any {
        if(cameraFrameRate) {
            switch(Number(cameraFrameRate)) {
                case 30:
                    return OTCameraCaptureFrameRate.OTCameraCaptureFrameRate30FPS;
                case 15:
                    return OTCameraCaptureFrameRate.OTCameraCaptureFrameRate15FPS;
                case 7:
                    return OTCameraCaptureFrameRate.OTCameraCaptureFrameRate7FPS;
                case 1:
                    return OTCameraCaptureFrameRate.OTCameraCaptureFrameRate1FPS;
            }
        }
        return OTCameraCaptureFrameRate.OTCameraCaptureFrameRate30FPS;
    }

    cycleCamera(): void {
        if(this._ios) {
            if(this._ios.cameraPosition === AVCaptureDevicePositionBack) {
                this._ios.cameraPosition = AVCaptureDevicePositionFront;
            }
            else {
                this._ios.cameraPosition = AVCaptureDevicePositionBack;
            }
        }
    }

    toggleCamera(): void {
        if(this._ios) {
            this._ios.publishVideo = !this._ios.publishVideo;
        }
    }

    toggleMute():void  {
        if(this._ios) {
            this._ios.publishAudio = !this._ios.publishAudio;
        }
    }

    get events(): Observable {
        return this._publisherKitDelegate.events;
    }

}

class TNSPublisherKitDelegateImpl extends NSObject {

    public static ObjCProtocols = [OTPublisherKitDelegate];

    private _events: Observable;
    private _owner: WeakRef<any>;

    public static initWithOwner(owner: WeakRef<any>): TNSPublisherKitDelegateImpl {
        let publisherKitDelegate = new TNSPublisherKitDelegateImpl();
        publisherKitDelegate._events = new Observable();
        publisherKitDelegate._owner = owner;
        return publisherKitDelegate;
    }

    public publisherStreamCreated(publisher: any, stream: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'streamCreated',
                object: new Observable({
                    publisher: publisher,
                    stream: stream
                })
            });
        }
    }

    public publisherStreamDestroyed(publisher: any, stream: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'streamDestroyed',
                object: new Observable({
                    publisher: publisher,
                    stream: stream
                })
            });
        }
        topmost().currentPage.ios.view.removeFromSuperview(publisher.view);
    }

    public publisherDidFailWithError(publisher: any, error: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'didFailWithError',
                object: new Observable({
                    publisher: publisher,
                    error: error
                })
            });
        }
    }

    get events(): Observable {
        return this._events;
    }

}