import { isAndroid } from "platform";
import {TNSSessionI} from '../common';
import * as app from 'application';

var frame = require("ui/frame");

declare var com: any, android: any;

const Session = com.opentok.android.Session;
const Subscriber = com.opentok.android.Subscriber;
const Publisher = com.opentok.android.Publisher;
const BaseVideoRenderer = com.opentok.android.BaseVideoRenderer;
const RelativeLayout = android.widget.RelativeLayout;

export class TNSSession implements TNSSessionI {

    private _apiKey: string;

    private _session: any;
    private _publisher: any;
    private _context: any;
    private _subscriber: any;

    constructor(apiKey: string) {
        if (!isAndroid) {
            console.log('Not supported for iOS');
            return;
        }
        this._apiKey = apiKey;
    }

    public create(sessionId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if(!this._apiKey) {
                console.log('API key not set. Please use the constructor to set the API key');
                reject('API Key Set');
            }
            this._session = new Session(app.android.context, this._apiKey, sessionId);
            this._session.setSessionListener(this._session.SessionListener);
            if(this._session) {
                console.log('OpenTok session: ' + this._session);
                resolve(true);
            }
            else {
                reject('OpenTok session creation failed.');
            }
        });
    }

    /**
     * Asynchronously begins the session connect process. Some time later, we will
     * expect a delegate method to call us back with the results of this action.
     *
     * @param {string} token The OpenTok token to join an existing session
     * @returns {Promise<any>}
     */
    public connect(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let session = this._session;
            if(session) {
                try {
                    session.connect(token);
                    resolve(true);
                } catch(err) {
                    reject(err);
                }
            }
        });
    }

    public disconnect(): Promise<any> {
        return new Promise((resolve, reject) => {

        });
     }

    public publish(publisherViewContainer: any) {
        let session = this._session;
        if(session) {
            this._publisher = new Publisher(app.android.context, 'publisher');
            this._publisher.setPublisherListener(session.StreamPropertiesListener);
            console.log('Init publisher: ' + this._publisher);
            this.attachPublisherView(frame.topmost().currentPage);
            session.publish(this._publisher);
        }
    }

    private attachPublisherView(publisherViewContainer: any) {
        // this._publisher.setCameraListener(this._session.StreamPropertiesListener);
        this._publisher.setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);
        var layoutParams = new RelativeLayout.LayoutParams(320, 240);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM, RelativeLayout.TRUE);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT, RelativeLayout.TRUE);
        publisherViewContainer.addView(this._publisher.getView(), layoutParams);
    }

    public subscribe(stream: any): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('Stream Received: ' + stream);
            if(!this._subscriber) {
                this._subscriber = new Subscriber(app.android.context, stream);
                this._subscriber.setSubscriberListener(app.android.context);
                this._subscriber.getRenderer().setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE,
                        BaseVideoRenderer.STYLE_VIDEO_FILL);
                this._session.subscribe(this._subscriber);
            }
        });
    }

    public unsubscribe(): Promise<any> {
        return new Promise((resolve, reject) => {

        });
    }

}