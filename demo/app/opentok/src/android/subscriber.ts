import {Observable} from "data/observable";
import {View} from 'ui/core/view'
import {Observable} from "data/observable";
declare var com: any, android: any;
const StreamListener = com.opentok.android.SubscriberKit.StreamListener;
const SubscriberListener = com.opentok.android.SubscriberKit.SubscriberListener;
/**
 * Created by Osei on 8/19/2016.
 */
export class TNSOTSubscriber extends View {
    _android: any;
    _subscriber: any;

    get android() {
        return this._android;
    }

    get _nativeView() {
        return this._android;
    }

    get subscriber(){
        return this._subscriber;
    }
    _createUI() {
        const that = new WeakRef(this);
        this._subscriber = new com.opentok.android.Subscriber(this._context);
        this._subscriber.setSubscriberListener( new SubscriberListener({
                owner: that.get(),
                onConnected(subscriber){
                    if (this.owner) {
                        this.owner.notify({
                            eventName: 'subscriberDidConnectToStream',
                            object: new Observable({
                                subscriber: subscriber
                            })
                        });
                    }
                },
                onDisconnected(subscriber){
                    if (this.owner) {
                        this.owner.notify({
                            eventName: 'subscriberDidDisconnect',
                            object: new Observable(subscriber)
                        });
                    }
                },
                onError(subscriber, error){
                    if (this.owner) {
                        this.owner.notify({
                            eventName: 'didFailWithError',
                            object: new Observable({
                                subscriber: subscriber,
                                error: error
                            })
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
                        object: subscriber
                    });
                }
            },
            onReconnected(subscriber){
                if (this.owner) {
                    this.owner.notify({
                        eventName: 'didReconnectToStream',
                        object: subscriber
                    });
                }
            }
        }));
        this._android = new android.widget.LinearLayout(this._context);
    }

    subscribe(session:any,stream:any){
        this._subscriber.subscribe(session,stream);
        let sub = this._subscriber.getView();
        this.android.addView(sub);
    }

    toggleVideo() {
        this._subscriber.setSubscribeToVideo();
    }

    setVideoActive(state: boolean) {

    }

    toggleAudio() {
        this._subscriber.setSubscribeToAudio();
    }

    setAudioActive(state: boolean) {

    }


}