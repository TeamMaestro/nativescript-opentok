import {topmost} from 'ui/frame';
import {TNSOTPublisherDelegate} from './publisher-delegate';

declare var OTPublisher: any, CGRectMake: any;

export class TNSOTPublisher {

    public nativePublisher: any;
    private _delegate: any;

    private defaultVideoLocationX: number = 0;
    private defaultVideoLocationY: number = 0;
    private defaultVideoHeight: number = 100;
    private defaultVideoWidth: number = 100;

    constructor(emitEvents?: boolean) {
        this._delegate = new TNSOTPublisherDelegate();
        this._delegate.initPublisher(emitEvents);
    }

    init(session: any, videoLocationX?: number, videoLocationY?: number, videoWidth?: number, videoHeight?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            if (session) {
                this.nativePublisher = new OTPublisher(this._delegate);
                try {
                    session.publish(this.nativePublisher);
                } catch (error) {
                    reject(error);
                }
                if (this.nativePublisher) {
                    topmost().currentPage.ios.view.addSubview(this.nativePublisher.view)
                    videoLocationX = videoLocationX ? videoLocationX : this.defaultVideoLocationX;
                    videoLocationY = videoLocationY ? videoLocationY : this.defaultVideoLocationY;
                    videoWidth = videoWidth ? videoWidth : this.defaultVideoWidth;
                    videoHeight = videoHeight ? videoHeight : this.defaultVideoHeight;
                    this.nativePublisher.view.frame = CGRectMake(videoLocationX, videoLocationY, videoWidth, videoHeight);
                }
                resolve(this.nativePublisher);
            }
        });
    }

    delegate(): any {
        return this._delegate;
    }



}