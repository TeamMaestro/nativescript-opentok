import { Observable, fromObject } from 'tns-core-modules/data/observable';
import { topmost } from 'tns-core-modules/ui/frame';
import { View, layout } from 'tns-core-modules/ui/core/view';
import { TNSOTSession } from './session';
import * as utils from 'tns-core-modules/utils/utils';
declare var OTPublisher: any,
    interop: any,
    OTPublisherKitDelegate: any,
    OTCameraCaptureResolution: any,
    OTCameraCaptureFrameRate: any,
    AVCaptureDevicePositionBack: any,
    AVCaptureDevicePositionFront: any;

export class TNSOTPublisher extends View {
    private _ios: any = {};
    nativeView: UIView;
    private _publisherKitDelegate: any;

    public createNativeView() {
        return UIView.new();
    }
    public initNativeView() {
        this._publisherKitDelegate = TNSPublisherKitDelegateImpl.initWithOwner(new WeakRef(this));
    }
    public disposeNativeView() {
        this._publisherKitDelegate = null;
    }
    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number) {
        const nativeView = this.nativeView;
        if (nativeView) {
            const width = layout.getMeasureSpecSize(widthMeasureSpec);
            const height = layout.getMeasureSpecSize(heightMeasureSpec);
            this.setMeasuredDimension(width, height);
        }
    }

    showCamera(name?: string, cameraResolution?: string, cameraFrameRate?: string): void {
        this._ios = OTPublisher.alloc().initWithDelegateNameCameraResolutionCameraFrameRate(
            this._publisherKitDelegate,
            name ? name : '',
            this.getCameraResolution(cameraResolution),
            this.getCameraFrameRate(cameraFrameRate)
        );
        this._ios.view.frame = this.nativeView.bounds;
        this.nativeView.addSubview(this._ios.view);
    }

    publish(session: TNSOTSession, name?: string, cameraResolution?: string, cameraFrameRate?: string): void {
        this._ios = OTPublisher.alloc().initWithDelegateNameCameraResolutionCameraFrameRate(
            this._publisherKitDelegate,
            name ? name : '',
            this.getCameraResolution(cameraResolution),
            this.getCameraFrameRate(cameraFrameRate)
        );
        this._ios.view.frame = this.nativeView.bounds;
        this.nativeView.addSubview(this._ios.view);
        session.events.on('sessionDidConnect', (result) => {
            this._ios.publishAudio = true;
            let stream: any = result.object;
            this.setIdleTimer(true);
            try {
                stream.session.publish(this._ios);
            } catch (error) {
                console.log(error);
            }
        });
    }

    unpublish(session: TNSOTSession): void {
        try {
            if (session) {
                let errorRef = new interop.Reference();
                this.setIdleTimer(false);
                session._ios.unpublishError(this._ios, errorRef);
                if (errorRef.value) {
                    console.log(errorRef.value);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    get ios(): any {
        return this._ios;
    }

    private setIdleTimer(idleTimerDisabled: boolean) {
        let app: any;
        app = utils.ios.getter(UIApplication, UIApplication.sharedApplication);
        app.idleTimerDisabled = idleTimerDisabled;
    }

    private getCameraResolution(cameraResolution: string): any {
        if (cameraResolution) {
            switch (cameraResolution) {
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
        if (cameraFrameRate) {
            switch (Number(cameraFrameRate)) {
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
        if (this._ios) {
            if (this._ios.cameraPosition === AVCaptureDevicePositionBack) {
                this._ios.cameraPosition = AVCaptureDevicePositionFront;
            }
            else {
                this._ios.cameraPosition = AVCaptureDevicePositionBack;
            }
        }
    }

    toggleCamera(): void {
        if (this._ios) {
            this._ios.publishVideo = !this._ios.publishVideo;
        }
    }

    toggleMute(): void {
        if (this._ios) {
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
        if (this._events) {
            this._events.notify({
                eventName: 'streamCreated',
                object: fromObject({
                    publisher: publisher,
                    stream: stream
                })
            });
        }
    }

    public publisherStreamDestroyed(publisher: any, stream: any) {
        if (this._events) {
            this._events.notify({
                eventName: 'streamDestroyed',
                object: fromObject({
                    publisher: publisher,
                    stream: stream
                })
            });
        }
    }

    public publisherDidFailWithError(publisher: any, error: any) {
        if (this._events) {
            this._events.notify({
                eventName: 'didFailWithError',
                object: fromObject({
                    publisher: publisher,
                    error: error
                })
            });
        }
        console.log(error);
    }

    get events(): Observable {
        return this._events;
    }

}