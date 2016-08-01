import * as app from 'application';

import {TNSOTPublisherI} from '../common';

declare var com: any, android: any;

const Publisher = com.opentok.android.Publisher;
const BaseVideoRenderer = com.opentok.android.BaseVideoRenderer;
const AbsoluteLayout = android.widget.AbsoluteLayout;
const RelativeLayout = android.widget.RelativeLayout;

export class TNSOTPublisher implements TNSOTPublisherI {

    public nativePublisher: any;

    constructor(emitEvents?: boolean) {
        // this._delegate = new TNSOTPublisherDelegate();
        // this._delegate.initPublisher(emitEvents);
    }

    init(session: any, videoLocationX?: number, videoLocationY?: number, videoWidth?: number, videoHeight?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.nativePublisher = new Publisher(app.android.context);
            // this.nativePublisher.setPublisherListener(app.android.context);
            // this.nativePublisher.setPublisherListener(session.StreamPropertiesListener);
            console.log('Init publisher: ' + this.nativePublisher);
            this.attachPublisherView(videoLocationX, videoLocationY, videoWidth, videoHeight);
            this.nativePublisher.startPreview();
            try {
                session.publish(this.nativePublisher);
                resolve();
            }
            catch(error) {
                reject(error);
            }
        });
    }

    private attachPublisherView(videoLocationX: number, videoLocationY: number, videoWidth: number, videoHeight: number) {
        // this._publisher.setCameraListener(this._session.StreamPropertiesListener);
        this.nativePublisher.setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);
        if(!videoWidth || videoWidth === -1) {
            videoWidth = app.android.foregroundActivity.getResources().getDisplayMetrics().widthPixels;
        }
        if(!videoHeight || videoHeight === -1) {
            videoHeight = app.android.foregroundActivity.getResources().getDisplayMetrics().heightPixels;
        }
        var layoutParams = new AbsoluteLayout.LayoutParams(300, 300, 120, 120);
        app.android.foregroundActivity.addContentView(this.nativePublisher.getView(), layoutParams);
    }

    toggleVideo(): Promise<any> {
        return new Promise((resolve, reject) => {
            let publisher = this.nativePublisher;
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
            let publisher = this.nativePublisher;
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
        let publisher = this.nativePublisher;
        if(publisher) {
            publisher.setPublishVideo(state);
        }
    }

    setAudioActive(state: boolean) {
        let publisher = this.nativePublisher;
        if(publisher) {
            publisher.setPublishAudio(state);
        }
    }

    toggleCameraPosition() {

    }

    instance() {

    }

}