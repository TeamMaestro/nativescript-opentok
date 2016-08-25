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
            console.log('loaded successfully!');
            this.connect();
        };

        console.log('created publisher...' + this._ios);
    }

    private connect() {
        if(this._apiKey && this._sessionId && this._token) {
            console.log('here...' + this._apiKey);
            let session = new TNSOTSession(this._apiKey);
            session.initSession(this._sessionId).then((result) => {
                session.connect(this._token).then((result) => {
                    console.log('this was called...' + result);
                    this.publish(result);
                }, (error) => {
                    console.log('Failed to connect to session: ' + error);
                });
            }, (error) => {
                console.log('Failed to initialize session: ' + error);
            });
        }
    }

    publish(session: any) {
        console.log('here....');
        this._ios.publishAudio = true;
        console.log('getting ready to publish!');
        try {
            session.publish(this._ios);
        } catch (error) {
            console.log(error);
        }
        if (this._ios) {
            this._ios.view.frame = CGRectMake(0, 0, screen.mainScreen.widthDIPs, screen.mainScreen.heightDIPs);

            let button:UIButton = UIButton.buttonWithType(UIButtonType.UIButtonTypeRoundedRect);
            button.frame = CGRectMake(100, 15, 100, 20);
            button.setTitleForState('Hello', UIControlState.UIControlStateNormal);
            this._ios.view.addSubview(button);
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
        console.log('set api key - ' + apiKey);
        this.connect();
    }

    set token(token: string) {
        this._token = token;
        this.connect();
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