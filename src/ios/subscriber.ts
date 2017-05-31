import { Observable, fromObject } from 'tns-core-modules/data/observable';
import { topmost } from 'tns-core-modules/ui/frame';
import { screen } from 'tns-core-modules/platform';
import { View, layout } from 'tns-core-modules/ui/core/view';
import { TNSOTSession } from './session';
import { TNSOTPublisher } from './publisher';

declare var OTSubscriber: any,
    OTSession: any,
    OTStream: any,
    OTSubscriberKitDelegate: any,
    interop: any,
    CGRectMake: any;

export class TNSOTSubscriber extends View {
    private _subscriberKitDelegate: any;
    private _ios: any;
    nativeView: UIView;
    public createNativeView() {
        return UIView.new();
    }
    public initNativeView() {
        this._subscriberKitDelegate = TNSSubscriberKitDelegateImpl.initWithOwner(new WeakRef(this));
    }

    public disposeNativeView() {
        this._subscriberKitDelegate = null;
    }
    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number) {
        const nativeView = this.nativeView;
        if (nativeView) {
            const width = layout.getMeasureSpecSize(widthMeasureSpec);
            const height = layout.getMeasureSpecSize(heightMeasureSpec);
            this.setMeasuredDimension(width, height);
        }
    }
    subscribe(session: any, stream: any) {
        this._ios = new OTSubscriber(stream, this._subscriberKitDelegate);
        this._ios.view.frame = this.nativeView.bounds;
        this.nativeView.addSubview(this._ios.view);
        let errorRef = new interop.Reference();

        if (session instanceof TNSOTSession) {
            session._ios.subscribeError(this._ios, errorRef);
        } else if (session instanceof OTSession) {
            session.subscribeError(this._ios, errorRef);
        }
        if (errorRef.value) {
            console.log(errorRef.value);
        }
    }

    unsubscribe(session: any) {
        try {
            let errorRef = new interop.Reference();
            session._ios.unsubscribeError(this._ios, errorRef);
            if (errorRef.value) {
                console.log(errorRef.value);
            }
        } catch (error) {
            console.log(error);
        }
    }

    get events(): Observable {
        return this._subscriberKitDelegate.events;
    }

    get ios(): any {
        return this._ios;
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
        if (this._events) {
            this._events.notify({
                eventName: 'didFailWithError',
                object: fromObject({
                    subscriber: subscriber,
                    error: error
                })
            });
        }
    }

    subscriberDidConnectToStream(subscriber) {
        if (this._events) {
            this._events.notify({
                eventName: 'subscriberDidConnectToStream',
                object: fromObject({
                    subscriber: subscriber
                })
            });
        }
    }

    subscriberDidDisconnectFromStream(subscriber: any) {
        if (this._events) {
            this._events.notify({
                eventName: 'didDisconnectFromStream',
                object: fromObject({
                    subscriber: subscriber
                })
            });
        }
    }

    subscriberDidReconnectToStream(subscriber: any) {
        if (this._events) {
            this._events.notify({
                eventName: 'didReconnectToStream',
                object: fromObject({
                    subscriber: subscriber
                })
            });
        }
    }

    subscriberVideoDisableWarning(subscriber: any) {
        if (this._events) {
            this._events.notify({
                eventName: 'subscriberVideoDisableWarning',
                object: fromObject({
                    subscriber: subscriber
                })
            });
        }
    }

    subscriberVideoDisableWarningLifted(subscriber: any) {
        if (this._events) {
            this._events.notify({
                eventName: 'subscriberVideoDisableWarningLifted',
                object: fromObject({
                    subscriber: subscriber
                })
            });
        }
    }

    subscriberVideoDisabledReason(subscriber, reason) {
        if (this._events) {
            this._events.notify({
                eventName: 'subscriberVideoDisabledReason',
                object: fromObject({
                    subscriber: subscriber,
                    reason: reason
                })
            });
        }
    }

    subscriberVideoEnabledReason(subscriber, reason) {
        if (this._events) {
            this._events.notify({
                eventName: 'subscriberVideoEnabledReason',
                object: fromObject({
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