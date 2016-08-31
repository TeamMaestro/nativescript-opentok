        import * as app from 'application';
        import {ContentView} from 'ui/content-view'
        import {Observable} from "data/observable";
        declare var com: any, android: any;
        const CameraListener = com.opentok.android.Publisher.CameraListener;
        const PublisherListener = com.opentok.android.PublisherKit.PublisherListener;
        const Publisher = com.opentok.android.Publisher;
        const BaseVideoRenderer = com.opentok.android.BaseVideoRenderer;
        const AbsoluteLayout = android.widget.AbsoluteLayout;
        const RelativeLayout = android.widget.RelativeLayout;
        export class TNSOTPublisher extends ContentView {
            private _android: any;
            private _publisher: any;
            public static toggleVideoEvent = "toggleVideo";
            public static toggleAudioEvent = "toggleAudio";
            public static cycleCameraEvent;
            private _publisherEvents;
            _render_style: any;

            constructor() {
                super();

            }

            get android() {
                return this._android;
            }

            get _nativeView() {
                return this._android;
            }

            _createUI() {
                const that = new WeakRef(this);
                this._publisher = new com.opentok.android.Publisher(app.android.foregroundActivity);
                this._publisher.getRenderer().setStyle(com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_SCALE,this.render_style);
                this._publisher.setPublisherListener(new PublisherListener({
                    owner: that.get(),
                    onError(publisher: any, error: any) {
                        if (this.owner) {
                            this.owner.notify({
                                eventName: 'didFailWithError',
                                object: this.owner,
                                publisher: publisher,
                                error: error
                            });
                        }
                    },
                    onStreamCreated(publisher: any, stream: any) {
                        if (this.owner) {
                            this.owner.notify({
                                eventName: 'streamCreated',
                                object: this.owner,
                                publisher: publisher,
                                stream: stream
                            });
                        }

                    },
                    onStreamDestroyed(publisher: any, stream: any) {
                        if (this.owner) {
                            this.owner.notify({
                                eventName: 'streamDestroyed',
                                object: this.owner,
                                publisher: publisher,
                                stream: stream
                            });
                        }
                    }
                }));
                this._publisher.setCameraListener(new CameraListener({
                    owner: that.get(),
                    onCameraChanged(publisher, newCameraId) {
                        if (this.owner) {
                            this.owner.notify({
                                eventName: 'cameraChanged',
                                object: this.owner,
                                publisher: publisher,
                                cameraId: newCameraId
                            });
                        }
                    }, onCameraError(publisher, error) {
                        if (this.owner) {
                            this.owner.notify({
                                eventName: 'cameraError',
                                object: this.owner,
                                publisher: publisher,
                                error: error
                            });
                        }
                    }
                }));
                let pub = this._publisher.getView();
                this._android = new android.widget.LinearLayout(this._context);
                this._android.addView(pub);
                
            }

            get render_style() {
                return this._render_style;
            }

            set render_style(value: any) {
                switch (value) {
                    case 'fit':
                        this._render_style = com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_FIT;
                        break;
                    case 'fill':
                        this._render_style = com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_FILL;
                        break;
                        default:
                        this._render_style = com.opentok.android.BaseVideoRenderer.STYLE_VIDEO_FIT;
                        break;
                }
            }

            get publisher() {
                return this._publisher;
            }

            toggleVideo() {
                let _isEnabled = this._publisher.getPublishVideo();
                if(_isEnabled){
                    this.setVideoActive(false);
                }else{
                    this.setVideoActive(true);
                }
            }

            toggleAudio() {
                let _isEnabled = this._publisher.getPublishAudio();
                if(_isEnabled){
                    this.setAudioActive(false);
                }else{
                    this.setAudioActive(true);
                }
            }

            setVideoActive(state: boolean) {
                this._publisher.setPublishVideo(state);
            }

            setAudioActive(state: boolean) {
                this._publisher.setPublishAudio(state);
            }

            cycleCamera() {
                this._publisher.cycleCamera();
            }

            instance() {
                return this._publisher;
            }

        }