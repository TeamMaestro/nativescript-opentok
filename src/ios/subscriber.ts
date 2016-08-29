import {Observable} from 'data/observable';
import {topmost} from 'ui/frame';
import {screen} from 'platform';
import {ContentView} from 'ui/content-view';
import {TNSOTSession} from './session';
import {TNSOTPublisher} from './publisher';

declare var OTSubscriber: any,
            OTSubscriberKitDelegate: any;

export class TNSOTSubscriber extends ContentView {

    private _subscriberKitDelegate: any;
    private _ios: any;
    private _sessionId: any;
    private _apiKey: string;
    private _token: string;

    constructor() {
        super();
        this._subscriberKitDelegate = TNSSubscriberKitDelegateImpl.initWithOwner(new WeakRef(this));
    }

    private connect() {
        if(this._apiKey && this._sessionId && this._token) {
            let session = new TNSOTSession(this._apiKey);
            session.initSession(this._sessionId).then(() => {
                session.connect(this._token).then((session) => {
                    console.log('Subscriber connected successfully...');
                }, error => {
                    console.log('Failed to connect to session: ' + error);
                });
            }, error => {
                console.log('Failed to intialize session: ' +  error);
            });

            session.events.on('sessionDidConnect', (session) => {
                console.log('session did connect!' + session);
                // let publisher = new TNSOTPublisher();
                // publisher.publish(session);
            });

            console.log('TNSOTSession - ' + session);
        }
    }

    subscribe(session: any, stream: any) {
        this._ios = new OTSubscriber(stream, this._subscriberKitDelegate);
        session.subscribe(this._ios);
    }

    /**
     * Cleans the subscriber from the view hierarchy, if any.
     *
     * @param {*} session THe session to unsubscribe from
     */
    // unsubscribe(session: any) {
    //     if(this._nativeSubscriber) {
    //         if(session) {
    //             try {
    //                 session.unsubscribe(this._nativeSubscriber);
    //             } catch(error) {
    //                 console.log('Failed to unsubscribe from session: ' + error);
    //             }
    //             this._nativeSubscriber.view.removeFromSuperview();
    //             this._nativeSubscriber = null;
    //         }
    //     }
    // }

    addSubscriberToView(subscriber: any) {
        // subscriber.view.frame = CGRectMake(this._defaultVideoLocationX, this._defaultVideoLocationY, this._defaultVideoWidth, this._defaultVideoHeight);
        // topmost().currentPage.ios.view.addSubview(subscriber.view);
        console.log('called addSubscriberToView');
        this._ios.view.frame = CGRectMake(0, 0, 150, 200);
        topmost().currentPage.ios.view.addSubview(this._ios.view);

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

}

class TNSSubscriberKitDelegateImpl extends NSObject {

    public static ObjCProtocols = [OTSubscriberKitDelegate];

    private _events: Observable;
    private _owner: WeakRef<any>;

    // private _config: any;
    // private _defaultVideoLocationX: number = 0;
    // private _defaultVideoLocationY: number = 0;
    // private _defaultVideoWidth: number = 150;
    // private _defaultVideoHeight: number = 150;

    public static initWithOwner(owner: WeakRef<any>): TNSSubscriberKitDelegateImpl {
        let subscriberKiDelegate = new TNSSubscriberKitDelegateImpl();
        subscriberKiDelegate._events = new Observable();
        subscriberKiDelegate._owner = owner;
        return subscriberKiDelegate;
    }

    subscriberDidFailWithError(subscriber: any, error: any) {
        console.log('subscriberDidFailWithError');
        if(this._events) {
            this._events.notify({
                eventName: 'didFailWithError',
                object: new Observable({
                    subscriber: subscriber,
                    error: error
                })
            });
        }
    }

    subscriberDidConnectToStream(subscriber) {
        console.log('subscriberDidConnectToStream');
        if(this._events) {
            this._events.notify({
                eventName: 'subscriberDidConnectToStream',
                object: new Observable({
                    subscriber: subscriber
                })
            });
        }
        let owner = this._owner.get();
        owner.addSubscriberToView(subscriber);
        // this.registerSubscriberToView(subscriber);
    }

    subscriberDidDisconnectFromStream(subscriber: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'didDisconnectFromStream',
                object: subscriber
            });
        }
    }

    subscriberDidReconnectToStream(subscriber: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'didReconnectToStream',
                object: subscriber
            });
        }
    }

    subscriberVideoDisableWarning(subscriber: any) {

    }

    subscriberVideoDisableWarningLifted(subscriber: any) {

    }

    subscriberVideoDisabledReason(subscriber, reason) {

    }

    subscriberVideoEnabledReason(subscriber, reason) {

    }

    // private registerSubscriberToView(subscriber: any) {
    //     subscriber.view.frame = CGRectMake(this._defaultVideoLocationX, this._defaultVideoLocationY, this._defaultVideoWidth, this._defaultVideoHeight);
    //     topmost().currentPage.ios.view.addSubview(subscriber.view);
    // }

    get events(): Observable {
        return this._events;
    }

}