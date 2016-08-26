import {Observable} from 'data/observable';
import {topmost} from 'ui/frame';
import {screen} from 'platform';
import {ContentView} from 'ui/content-view'
import {TNSOTSession} from './session';

declare var OTPublisher: any,
            CGRectMake: any,
            OTPublisherKitDelegate: any,
            AVCaptureDevicePositionBack: any,
            AVCaptureDevicePositionFront: any;

export class TNSOTPublisher extends ContentView {

    private _publisherKitDelegate: any;
    private _ios: any;
    private _sessionId: any;
    private _apiKey: string;
    private _token: string;

    constructor() {
        super();
        this._publisherKitDelegate = TNSPublisherKitDelegateImpl.initWithOwner(new WeakRef(this));
        this._ios = new OTPublisher(this._publisherKitDelegate);
    }

    _createUI() {
        this.onLoaded = () => {
            this.connect();
        };
    }

    private connect(): void {
        if(this._apiKey && this._sessionId && this._token) {
            let session = new TNSOTSession(this._apiKey);
            session.initSession(this._sessionId).then((result) => {
                session.connect(this._token).then((result) => {
                    this.publish(result);
                }, (error) => {
                    console.log('Failed to connect to session: ' + error);
                });
            }, (error) => {
                console.log('Failed to initialize session: ' + error);
            });
        }
    }

    publish(session: any): void {
        this._ios.publishAudio = true;
        try {
            session.publish(this._ios);
        } catch (error) {
            console.log(error);
        }
        if (this._ios) {
            this._ios.view.frame = CGRectMake(0, 0, screen.mainScreen.widthDIPs, screen.mainScreen.heightDIPs);
        }
    }

    get ios(): any {
        return this._ios;
    }

    get _nativeView(): any {
        return this._ios.view;
    }

    set session(sessionId: string) {
        this._sessionId = sessionId;
        this.connect();
    }

    set api(apiKey: string) {
        this._apiKey = apiKey;
        this.connect();
    }

    set token(token: string) {
        this._token = token;
        this.connect();
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

    toggleCamera() {
        if(this._ios) {
            this._ios.publishVideo = !this._ios.publishVideo;
        }
    }

    toggleMute() {
        if(this._ios) {
            this._ios.publishAudio = !this._ios.publishAudio;
        }
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

    didChangeCameraPosition(publisher: any, position: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'didChangeCameraPosition',
                object: new Observable({
                    publisher: publisher,
                    position: position
                })
            });
        }
    }

    streamCreated(publisher: any, stream: any) {
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

    streamDestroyed(publisher: any, stream: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'streamDestroyed',
                object: new Observable({
                    publisher: publisher,
                    stream: stream
                })
            });
        }
    }

    didFailWithError(publisher: any, error: any) {
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