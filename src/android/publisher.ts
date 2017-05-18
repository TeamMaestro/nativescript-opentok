import * as  utils from "tns-core-modules/utils/utils";
import * as app from 'tns-core-modules/application';
import { View, CssProperty, Style } from 'tns-core-modules/ui/core/view'
import { Observable, fromObject } from "tns-core-modules/data/observable";
import { TNSOTSession } from "./session";
import { RENDERSTYLE } from "../common";
declare var com: any, android: any;
const CameraListener = com.opentok.android.Publisher.CameraListener;
const PublisherListener = com.opentok.android.PublisherKit.PublisherListener;
const Publisher = com.opentok.android.Publisher;
const BaseVideoRenderer = com.opentok.android.BaseVideoRenderer;
const AbsoluteLayout = android.widget.AbsoluteLayout;
const RelativeLayout = android.widget.RelativeLayout;

const renderStyle = new CssProperty<Style, string>({
    name: 'renderStyle',
    cssName: 'render-style',
    defaultValue: 'fill',
    valueConverter: (v: RENDERSTYLE) => { return String(v) }
});

export class TNSOTPublisher extends View {
    private _publisher: any;
    public static toggleVideoEvent = "toggleVideo";
    public static toggleAudioEvent = "toggleAudio";
    public static cycleCameraEvent;
    private _events: any;
    private _renderStyle: any;
    public renderStyle: any;
    constructor() {
        super();
        this._events = fromObject({});
    }

    get android() {
        return this.nativeView;
    }

    public createNativeView() {
        return new android.widget.LinearLayout(this._context);
    }

    publish(session: TNSOTSession, name?: string, cameraResolution?: string, cameraFrameRate?: string) {
        const that = new WeakRef(this);
        this._publisher = new com.opentok.android.Publisher(
            utils.ad.getApplicationContext(),
            name ? name : '',
            TNSOTPublisher.getCameraResolution(cameraResolution),
            TNSOTPublisher.getCameraFrameRate(cameraFrameRate)
        );
        let pub = this._publisher.getView();
        this.nativeView.addView(pub);
        this.renderStyle = this._renderStyle;
        this._publisher.setPublisherListener(new PublisherListener({
            owner: that.get(),
            onError(publisher: any, error: any) {
                if (this.owner._events) {
                    this.owner._events.notify({
                        eventName: 'didFailWithError',
                        object: fromObject({
                            publisher: publisher,
                            error: error
                        })
                    });
                }
            },
            onStreamCreated(publisher: any, stream: any) {
                if (this.owner._events) {
                    this.owner._events.notify({
                        eventName: 'streamCreated',
                        object: fromObject({
                            publisher: publisher,
                            stream: stream
                        })
                    });
                }
            },
            onStreamDestroyed(publisher: any, stream: any) {
                if (this.owner._events) {
                    this.owner._events.notify({
                        eventName: 'streamDestroyed',
                        object: fromObject({
                            publisher: publisher,
                            stream: stream
                        })
                    });
                }
            }
        }));
        this._publisher.setCameraListener(new CameraListener({
            owner: that.get(),
            onCameraChanged(publisher, newCameraId) {
                if (this.owner._events) {
                    this.owner._events.notify({
                        eventName: 'cameraChanged',
                        object: fromObject({
                            publisher: publisher,
                            cameraId: newCameraId
                        })
                    });
                }
            }, onCameraError(publisher, error) {
                if (this.owner._events) {
                    this.owner._events.notify({
                        eventName: 'cameraError',
                        object: fromObject({
                            publisher: publisher,
                            error: error
                        })
                    });
                }
            }
        }));
        session.events.on('sessionDidConnect', (result: any) => {
            try {
                let stream: any = result.object;
                session.session.publish(this._publisher);
            } catch (error) {
                console.log(error);
            }
        });

    }

    public static getCameraResolution(cameraResolution) {
        if (cameraResolution) {
            switch (cameraResolution.toString().toUpperCase()) {
                case 'LOW':
                    return com.opentok.android.Publisher.CameraCaptureResolution.LOW;
                case 'MEDIUM':
                    return com.opentok.android.Publisher.CameraCaptureResolution.MEDIUM;
                case 'HIGH':
                    return com.opentok.android.Publisher.CameraCaptureResolution.HIGH;
            }
        }
        return com.opentok.android.Publisher.CameraCaptureResolution.MEDIUM;
    }

    public static getCameraFrameRate(cameraFrameRate) {
        if (cameraFrameRate) {
            switch (Number(cameraFrameRate)) {
                case 30:
                    return com.opentok.android.Publisher.CameraCaptureFrameRate.FPS_30;
                case 15:
                    return com.opentok.android.Publisher.CameraCaptureFrameRate.FPS_15;
                case 7:
                    return com.opentok.android.Publisher.CameraCaptureFrameRate.FPS_7;
                case 1:
                    return com.opentok.android.Publisher.CameraCaptureFrameRate.FPS_1;
            }
        }
        return com.opentok.android.Publisher.CameraCaptureFrameRate.FPS_30;
    }

    [renderStyle.setNative](value: any) {
        this._renderStyle = value;
        switch (value) {
            case 'fill':
                this._publisher.getRenderer().setStyle(com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_SCALE, com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_FILL);
                break;
            case 'scale':
                this._publisher.getRenderer().setStyle(com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_SCALE, com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_SCALE);
                break;
            default:
                this._publisher.getRenderer().setStyle(com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_SCALE, com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_FIT);
                break;
        }
    }

    get publisher() {
        return this._publisher;
    }

    get events(): Observable {
        return this._events;
    }

    toggleCamera() {
        this.publishVideo = !this.publishVideo;
    }

    toggleVideo() {
        this.publishVideo = !this.publishVideo;
    }

    toggleMute() {
        this.publishAudio = !this.publishAudio;
    }

    get publishVideo(): boolean {
        return this._publisher.getPublishVideo();
    }

    set publishVideo(state: boolean) {
        this._publisher.setPublishVideo(state);
    }

    get publishAudio(): boolean {
        return this._publisher.getPublishAudio();
    }

    set publishAudio(state: boolean) {
        this._publisher.setPublishAudio(state);
    }

    cycleCamera() {
        this._publisher.cycleCamera();
    }

    instance() {
        return this._publisher;
    }

    unpublish(session: TNSOTSession) {
        session.session.unpublish(this._publisher);
    }

}
renderStyle.register(Style);