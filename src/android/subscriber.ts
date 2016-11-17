import {Observable} from "data/observable";
import {ContentView} from 'ui/content-view';
declare var com: any, android: any;
const StreamListener = com.opentok.android.SubscriberKit.StreamListener;
const SubscriberListener = com.opentok.android.SubscriberKit.SubscriberListener;
const BaseVideoRenderer = com.opentok.android.BaseVideoRenderer;
export class TNSOTSubscriber extends ContentView {
    private _android: any;
    private _subscriber: any;

    get android() {
        return this._android;
    }

    get _nativeView() {
        return this._android;
    }

    get subscriber() {
        return this._subscriber;
    }

    _createUI() {
        this._android = new android.widget.LinearLayout(this._context);
    }

    subscribe(session: any, stream: any) {
        const that = new WeakRef(this);
        this._subscriber = new com.opentok.android.Subscriber(this._context, stream);
        this._subscriber.getRenderer().setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE,
            BaseVideoRenderer.STYLE_VIDEO_FILL);
        this._subscriber.setSubscriberListener(new SubscriberListener({
            owner: that.get(),
            onConnected(subscriber){
                if (this.owner) {
                    this.owner.notify({
                        eventName: 'subscriberDidConnectToStream',
                        object: this.owner,
                        subscriber:subscriber
                    });
                }
            },
            onDisconnected(subscriber){
                if (this.owner) {
                    this.owner.notify({
                        eventName: 'subscriberDidDisconnect',
                        object: this.owner,
                        subscriber:subscriber
                    });
                }
            },
            onError(subscriber, error){
                if (this.owner) {
                    this.owner.notify({
                        eventName: 'didFailWithError',
                        object: this.owner,
                        subscriber: subscriber,
                        error: error
                    });
                }
            },
        }));
        this._subscriber.setStreamListener(new StreamListener({
            owner: that.get(),
            onDisconnected(subscriber){
                if (this.owner) {
                    this.owner.notify({
                        eventName: 'didDisconnectFromStream',
                        object: this.owner,
                        subscriber:subscriber
                    });
                }
            },
            onReconnected(subscriber){
                if (this.owner) {
                    this.owner.notify({
                        eventName: 'didReconnectToStream',
                        object: this.owner,
                        subscriber:subscriber
                    });
                }
            }
        }));
        let sub = this._subscriber.getView();
        this.android.addView(sub);
    }

    toggleVideo() {
        let _isEnabled = this._subscriber.getSubscribeToVideo();
        if (_isEnabled) {
            this.setVideoActive(false);
        } else {
            this.setVideoActive(true);
        }
    }

    setVideoActive(state: boolean) {
        this._subscriber.setSubscribeToVideo(state);
    }

    toggleAudio() {
        let _isEnabled = this._subscriber.getSubscribeToAudio();
        if (_isEnabled) {
            this.setAudioActive(false);
        } else {
            this.setAudioActive(true);
        }
    }

    setAudioActive(state: boolean) {
        this._subscriber.setSubscribeToAudio(state);
    }


}