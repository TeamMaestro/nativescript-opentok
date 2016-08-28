import {Observable} from 'data/observable';
import {topmost} from 'ui/frame';
import {TNSOTSubscriberI} from '../common';

declare var OTSubscriber: any,
            CGRectMake: any,
            OTSubscriberKitDelegate: any;

export class TNSOTSubscriber implements TNSOTSubscriberI {

    private _subscriberKitDelegate: TNSSubscriberKitDelegate;
    private _nativeSubscriber: any;

    constructor(config?: any) {
        this._subscriberKitDelegate = new TNSSubscriberKitDelegate();
        this._subscriberKitDelegate.initSubscriberEvents(true, config);
    }

    subscribe(session: any, stream: any) {
        this._nativeSubscriber = new OTSubscriber(stream, this._subscriberKitDelegate);
        session.subscribe(this._nativeSubscriber);
    }

    /**
     * Cleans the subscriber from the view hierarchy, if any.
     *
     * @param {*} session THe session to unsubscribe from
     */
    unsubscribe(session: any) {
        if(this._nativeSubscriber) {
            if(session) {
                try {
                    session.unsubscribe(this._nativeSubscriber);
                } catch(error) {
                    console.log('Failed to unsubscribe from session: ' + error);
                }
                this._nativeSubscriber.view.removeFromSuperview();
                this._nativeSubscriber = null;
            }
        }
    }

    /**
     * Cleans the subscriber from the view hierarchy, if any.
     * NB: You do *not* have to call unsubscribe in your controller in response to
     * a streamDestroyed event. Any subscribers (or the publisher) for a stream will
     * be automatically removed from the session during cleanup of the stream.
     */
    cleanup() {
        let subscriber = this._nativeSubscriber;
        if(subscriber) {
            subscriber.view.removeFromSuperview();
            subscriber = null;
            this._subscriberKitDelegate.subscriberEvents.notify({
                eventName: 'didStopSubscribing',
                object: null
            });
        }
    }

    toggleVideo() {
        if(this._nativeSubscriber) {
            this._nativeSubscriber.subscribeToVideo = !this._nativeSubscriber.subscribeToVideo;
        }
    }

    setVideoActive(state: boolean) {
        if(this._nativeSubscriber) {
            this._nativeSubscriber.subscribeToVideo = state;
        }
    }

    toggleAudio() {
        if(this._nativeSubscriber) {
            this._nativeSubscriber.subscribeToAudio = !this._nativeSubscriber.subscribeToAudio;
        }
    }

    setAudioActive(state: boolean) {
        if(this._nativeSubscriber) {
            this._nativeSubscriber.subscribeToAudio = state;
        }
    }

    get subscriberEvents(): Observable {
        return this._subscriberKitDelegate.subscriberEvents;
    }

}

class TNSSubscriberKitDelegate extends NSObject {

    public static ObjCProtocols = [OTSubscriberKitDelegate];

    private _subscriberEvents: Observable;
    private _config: any;
    private _defaultVideoLocationX: number = 0;
    private _defaultVideoLocationY: number = 0;
    private _defaultVideoWidth: number = 150;
    private _defaultVideoHeight: number = 150;

    initSubscriberEvents(emitEvents: boolean = true, config?: any) {
        if(emitEvents) {
            this._subscriberEvents = new Observable();
        }
        this._config = config;
    }

    subscriberDidFailWithError(subscriber: any, error: any) {
        if(this._subscriberEvents) {
            this._subscriberEvents.notify({
                eventName: 'didFailWithError',
                object: new Observable({
                    subscriber: subscriber,
                    error: error
                })
            });
        }
    }

    subscriberDidConnectToStream(subscriber) {
         if(this._subscriberEvents) {
            this._subscriberEvents.notify({
                eventName: 'subscriberDidConnectToStream',
                object: new Observable({
                    subscriber: subscriber
                })
            });
        }
        this.registerSubscriberToView(subscriber);
    }

    subscriberDidDisconnectFromStream(subscriber: any) {
        if(this._subscriberEvents) {
            this._subscriberEvents.notify({
                eventName: 'didDisconnectFromStream',
                object: subscriber
            });
        }
    }

    subscriberDidReconnectToStream(subscriber: any) {
         if(this._subscriberEvents) {
            this._subscriberEvents.notify({
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

    private registerSubscriberToView(subscriber: any) {
        if(this._config && this._config.subscriber) {
            let config = this._config.subscriber;
            subscriber.view.frame = CGRectMake(config.videoLocationX, config.videoLocationY, config.videoWidth, config.videoHeight);
        }
        else {
            subscriber.view.frame = CGRectMake(this._defaultVideoLocationX, this._defaultVideoLocationY, this._defaultVideoWidth, this._defaultVideoHeight);
        }
        topmost().currentPage.ios.view.addSubview(subscriber.view);
    }

    get subscriberEvents(): Observable {
        return this._subscriberEvents;
    }

}