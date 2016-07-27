import { isAndroid } from "platform";
import {TNSOTSessionI} from '../common';
import {TNSSessionListener} from './session-listener';
import * as app from 'application';

declare var com: any, android: any;

const Session = com.opentok.android.Session;
const Subscriber = com.opentok.android.Subscriber;
const Publisher = com.opentok.android.Publisher;
const BaseVideoRenderer = com.opentok.android.BaseVideoRenderer;
const AbsoluteLayout = android.widget.AbsoluteLayout;
const RelativeLayout = android.widget.RelativeLayout;

var CAMERA_PERMISSION_REQUEST_CODE = 555;

export class TNSOTSession implements TNSOTSessionI {

    private _apiKey: string;

    private _session: any;
    private _publisher: any;
    private _context: any;
    private _subscriber: any;

    private _delegate: TNSSessionListener;

    constructor(apiKey: string, emitEvents?: boolean, emitPublisherEvents?: boolean) {
        if (!isAndroid) {
            console.log('Not supported for iOS');
            return;
        }
        this._apiKey = apiKey;
        // if(!this.cameraAccessPermissionGranted()) {
        //     this.requestCameraPermission();
        // }
        this._delegate = new TNSSessionListener();
        this._delegate.initSession(emitEvents);
    }

    public create(sessionId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this._apiKey) {
                console.log('API key not set. Please use the constructor to set the API key');
                reject('API Key Set');
            }
            this._session = new Session(app.android.context, this._apiKey, sessionId);
            // this._session.setSessionListener(this._delegate);
            if (this._session) {
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
            if (session) {
                try {
                    session.connect(token);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        });
    }

    public disconnect(): Promise<any> {
        return new Promise((resolve, reject) => {

        });
    }

    public publish(videoLocationX: number, videoLocationY: number, videoWidth: number, videoHeight: number) {
        let session = this._session;
        if (session) {
            this._publisher = new Publisher(app.android.context, 'publisher');
            this._publisher.setPublisherListener(session.StreamPropertiesListener);
            console.log('Init publisher: ' + this._publisher);
            this.attachPublisherView(videoLocationX, videoLocationY, videoWidth, videoHeight);
            session.publish(this._publisher);
        }
    }

    // private cameraAccessPermissionGranted() {
    //     var hasPermission = android.os.Build.VERSION.SDK_INT < 23; // Android M. (6.0)
    //     if (!hasPermission) {
    //         hasPermission = android.content.pm.PackageManager.PERMISSION_GRANTED ==
    //             android.support.v4.content.ContextCompat.checkSelfPermission(app.android.currentContext, android.Manifest.permission.CAMERA);
    //     }
    //     return hasPermission;
    // }

    // private requestCameraPermission() {
    //     android.support.v4.app.ActivityCompat.requestPermissions(
    //         app.android.currentContext,
    //         [android.Manifest.permission.CAMERA],
    //         CAMERA_PERMISSION_REQUEST_CODE);
    // }

    private attachPublisherView(videoLocationX: number, videoLocationY: number, videoWidth: number, videoHeight: number) {
        // this._publisher.setCameraListener(this._session.StreamPropertiesListener);
        this._publisher.setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);
        if(!videoWidth || videoWidth === -1) {
            videoWidth = app.android.foregroundActivity.getResources().getDisplayMetrics().widthPixels;
        }
        if(!videoHeight || videoHeight === -1) {
            videoHeight = app.android.foregroundActivity.getResources().getDisplayMetrics().heightPixels;
        }
        var layoutParams = new AbsoluteLayout.LayoutParams(300, 300, 120, 120);

        app.android.foregroundActivity.addContentView(this._publisher.getView(), layoutParams);

        this._publisher.getView().setZOrderOnTop(true);
        this._publisher.getView().setZOrderMediaOverlay(true);
    }

    public subscribe(stream: any): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('Stream Received: ' + stream);
            if (!this._subscriber) {
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

    toggleVideo(): Promise<any> {
        return new Promise((resolve, reject) => {
            let publisher = this._publisher;
            if(publisher) {
                publisher.setPublishVideo(!publisher.getPublishVideo());
                resolve(publisher.getPublishVideo());
            }
            else {
                reject('Publisher not defined');
            }
        });
    }

    toggleAudio(): Promise<any> {
        return new Promise((resolve, reject) => {
            let publisher = this._publisher;
            if(publisher) {
                publisher.setPublishAudio(!publisher.getPublishAudio());
                resolve(publisher.getPublishAudio());
            }
            else {
                reject('Publisher not defined');
            }
        });
    }

    setVideoActive(state: boolean) {
        let publisher = this._publisher;
        if(publisher) {
            publisher.setPublishVideo(state);
        }
    }

    setAudioActive(state: boolean) {
        let publisher = this._publisher;
        if(publisher) {
            publisher.setPublishAudio(state);
        }
    }

    instance(): TNSSessionListener {
        return this._delegate;
    }

}