import { Observable, fromObject } from "data/observable";
import { ContentView } from 'tns-core-modules/ui/content-view';
import { TNSOTSession } from "./session";
import { RENDERSTYLE } from "../common";
import {
    Property,
    View,
    CssProperty,
    Style
} from "tns-core-modules/ui/core/view";
declare var com: any, android: any;
const StreamListener = com.opentok.android.SubscriberKit.StreamListener;
const SubscriberListener = com.opentok.android.SubscriberKit.SubscriberListener;
const BaseVideoRenderer = com.opentok.android.BaseVideoRenderer;
import * as utils from "utils/utils";

const renderStyle = new CssProperty<Style, string>({
    name: 'renderStyle',
    cssName: 'render-style',
    defaultValue: 'fill',
    valueConverter: (v: RENDERSTYLE) => { return String(v) }
});

export class TNSOTSubscriber extends View {
    private _android: any;
    private _subscriber: any;
    private _events: Observable;
    public renderStyle: any;
    private _renderStyle: any;
    constructor() {
        super();
        this._events = fromObject({});
    }

    get android() {
        return this.nativeView;
    }
    get subscriber() {
        return this._subscriber;
    }

    public createNativeView() {
        return new android.widget.LinearLayout(utils.ad.getApplicationContext());
    }

    subscribe(session: any, stream: any) {
        const that = new WeakRef(this);
        this._subscriber = new com.opentok.android.Subscriber(utils.ad.getApplicationContext(), stream);
        //this._subscriber.getRenderer().setStyle(com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_SCALE, this.render_style);
        this.renderStyle = this._renderStyle;
        this._subscriber.setSubscriberListener(new com.opentok.android.SubscriberKit.SubscriberListener({
            owner: that.get(),
            onConnected(subscriber) {
                if (this.owner._events) {
                    this.owner._events.notify({
                        eventName: 'subscriberDidConnectToStream',
                        object: fromObject({
                            subscriber: subscriber
                        })
                    });
                }
            },
            onDisconnected(subscriber) {
                if (this.owner._events) {
                    this.owner._events.notify({
                        eventName: 'subscriberDidDisconnect',
                        object: fromObject({
                            subscriber: subscriber
                        })
                    });
                }
            },
            onError(subscriber, error) {
                if (this.owner._events) {
                    this.owner._events.notify({
                        eventName: 'didFailWithError',
                        object: fromObject({
                            subscriber: subscriber,
                            error: error
                        })
                    });
                }
            },
        }));
        this._subscriber.setStreamListener(new com.opentok.android.SubscriberKit.StreamListener({
            owner: that.get(),
            onDisconnected(subscriber) {
                if (this.owner._events) {
                    this.owner._events.notify({
                        eventName: 'didDisconnectFromStream',
                        object: fromObject({
                            subscriber: subscriber
                        })
                    });
                }
            },
            onReconnected(subscriber) {
                if (this.owner._events) {
                    this.owner._events.notify({
                        eventName: 'didReconnectToStream',
                        object: fromObject({
                            subscriber: subscriber
                        })

                    });
                }
            }
        }));
        
        let sub = this._subscriber.getView();
        this.nativeView.addView(sub);

        if (session instanceof TNSOTSession) {
            session.session.subscribe(this._subscriber);
        } else {
            session.subscribe(this._subscriber);
        }

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

    get events(): Observable {
        return this._events;
    }

    [renderStyle.setNative](value: string) {
        this._renderStyle = value;
        if (this._subscriber) {
            switch (value) {
                case 'fit':
                    this._subscriber.getRenderer().setStyle(com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_SCALE, com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_FIT);
                    break;
                case 'scale':
                    this._subscriber.getRenderer().setStyle(com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_SCALE, com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_SCALE);
                    break;
                default:
                    this._subscriber.getRenderer().setStyle(com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_SCALE, com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_FILL);
                    break;
            }

        }
    }
}
renderStyle.register(Style);