import {Observable} from 'data/observable';
import {topmost} from 'ui/frame';
import {screen} from 'platform';
import {ContentView} from 'ui/content-view';
import {TNSOTSession} from './session';
import {TNSOTPublisher} from './publisher';

declare var OTSubscriber: any,
            OTStream: any,
            OTSubscriberKitDelegate: any,
            interop: any;

export class TNSOTSubscriber extends ContentView {

    private _subscriberKitDelegate: any;
    private _ios: any;
    private _view: UIView;

    constructor() {
        super();
        this._subscriberKitDelegate = TNSSubscriberKitDelegateImpl.initWithOwner(new WeakRef(this));
        this._view = UIView.alloc().init();
    }

    subscribe(session: any, stream: any) {
        this._ios = new OTSubscriber(stream, this._subscriberKitDelegate);
        this._ios.view.frame = CGRectMake(0, 0, screen.mainScreen.widthDIPs, screen.mainScreen.heightDIPs);
        this._view.addSubview(this._ios.view);
        let errorRef = new interop.Reference();
        session.subscribeError(this._ios, errorRef);
        if(errorRef.value) {
            console.log(errorRef.value);
        }
    }

    unsubscribe(session: any) {
        try {
            let errorRef = new interop.Reference();
            session._ios.unsubscribeError(this._ios, errorRef);
            if(errorRef.value) {
                console.log(errorRef.value);
            }
        } catch(error) {
            console.log(error);
        }
    }

    get events(): Observable {
        return this._subscriberKitDelegate.events;
    }

    get ios(): any {
        return this._ios;
    }

    get _nativeView(): any {
        return this._view;
    }

}

class TNSSubscriberKitDelegateImpl extends NSObject {

    public static ObjCProtocols = [OTSubscriberKitDelegate];

    private _events: Observable;
    private _owner: WeakRef<any>;

    public static initWithOwner(owner: WeakRef<any>): TNSSubscriberKitDelegateImpl {
        let subscriberKiDelegate = new TNSSubscriberKitDelegateImpl();
        subscriberKiDelegate._events = new Observable();
        subscriberKiDelegate._owner = owner;
        return subscriberKiDelegate;
    }

    subscriberDidFailWithError(subscriber: any, error: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'didFailWithError',
                object: new Observable({
                    subscriber: subscriber,
                    error: error
                })
            });
        }
        console.log(error);
    }

    subscriberDidConnectToStream(subscriber) {
        if(this._events) {
            this._events.notify({
                eventName: 'subscriberDidConnectToStream',
                object: new Observable({
                    subscriber: subscriber
                })
            });
        }
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
        if(this._events) {
            this._events.notify({
                eventName: 'subscriberVideoDisableWarning',
                object: subscriber
            });
        }
    }

    subscriberVideoDisableWarningLifted(subscriber: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'subscriberVideoDisableWarningLifted',
                object: subscriber
            });
        }
    }

    subscriberVideoDisabledReason(subscriber, reason) {
         if(this._events) {
            this._events.notify({
                eventName: 'subscriberVideoDisabledReason',
                object: new Observable({
                    subscriber: subscriber,
                    reason: reason
                })
            });
        }
    }

    subscriberVideoEnabledReason(subscriber, reason) {
        if(this._events) {
            this._events.notify({
                eventName: 'subscriberVideoEnabledReason',
                object: new Observable({
                    subscriber: subscriber,
                    reason: reason
                })
            });
        }
    }

    get events(): Observable {
        return this._events;
    }

}