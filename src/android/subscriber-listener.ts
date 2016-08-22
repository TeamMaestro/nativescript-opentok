import {Observable} from "data/observable";
import {topmost} from "ui/frame";
declare var com: any, android: any;
const StreamListener = com.opentok.android.SubscriberKit.StreamListener;
const SubscriberListener = com.opentok.android.SubscriberKit.SubscriberListener;
const VideoStatsListener = com.opentok.android.SubscriberKit.SubscriberKit.VideoStatsListener;
/**
 * Created by Osei on 8/19/2016.
 */
export class TNSOTSubscriberListener {

    private _subscriberEvents: Observable;
    private _config: any;
    private _defaultVideoLocationX: number = 0;
    private _defaultVideoLocationY: number = 0;
    private _defaultVideoWidth: number = 150;
    private _defaultVideoHeight: number = 150;
    private _streamListener: any;
    private _subscriberListener: any;

    constructor(emitEvents: boolean, config?: any) {
        this.initSubscriberEvents(emitEvents,config);
    }

    initSubscriberEvents(emitEvents: boolean = true, config?: any) {
        const that = new WeakRef(this);
        if (emitEvents) {
            this._subscriberEvents = new Observable();
            this._subscriberListener = new SubscriberListener({
                owner: that.get(),
                onConnected(subscriber){
                    if (this.owner._subscriberEvents) {
                        this.owner._subscriberEvents.notify({
                            eventName: 'subscriberDidConnectToStream',
                            object: new Observable({
                                subscriber: subscriber
                            })
                        });
                    }
                    //  this.registerSubscriberToView(subscriber);
                },
                onDisconnected(subscriber){
                },
                onError(subscriber, error){
                    if (this.owner._subscriberEvents) {
                        this.owner._subscriberEvents.notify({
                            eventName: 'didFailWithError',
                            object: new Observable({
                                subscriber: subscriber,
                                error: error
                            })
                        });
                    }
                },
            });

            this._streamListener = new StreamListener({
                owner: that.get(),
                onDisconnected(subscriber){
                    if (this.owner._subscriberEvents) {
                        this.owner._subscriberEvents.notify({
                            eventName: 'didDisconnectFromStream',
                            object: subscriber
                        });
                    }
                },
                onReconnected(subscriber){
                    if (this.owner._subscriberEvents) {
                        this.owner._subscriberEvents.notify({
                            eventName: 'didReconnectToStream',
                            object: subscriber
                        });
                    }
                }
            })

        }
        this._config = config;
    }


    get subscriberEvents(): Observable {
        return this._subscriberEvents;
    }
}