import {Observable} from 'data/observable';
import {topmost} from 'ui/frame';
import {screen} from 'platform';
import {ContentView} from 'ui/content-view';
import {TNSOTSession} from './session';
import {TNSOTPublisher} from './publisher';

declare var OTSubscriber: any,
            OTSubscriberKitDelegate: any;

export class TNSOTSubscriber  {

    private _subscriberKitDelegate: any;
    private _subscriber: any;

    private _session: any;

    constructor() {
        this._subscriberKitDelegate = TNSSubscriberKitDelegateImpl.initWithOwner(new WeakRef(this));
    }

    subscribe(session: any, stream: any) {
        this._subscriber = new OTSubscriber(stream, this._subscriberKitDelegate);
        session.subscribe(this._subscriber);
    }

    addSubscriberToView(subscriber: any) {
        let view = topmost().currentPage.getViewById('subscriber');
        if(view) {
            this._subscriber.view.frame = CGRectMake(0, 0, screen.mainScreen.widthDIPs, screen.mainScreen.heightDIPs);
            view.ios.addSubview(this._subscriber.view);
        }
    }

    get events(): Observable {
        return this._subscriberKitDelegate.events;
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