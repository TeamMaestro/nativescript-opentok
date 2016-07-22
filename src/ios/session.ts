import * as app from 'application';
import {TNSSessionI} from '../common';

var frame = require("ui/frame");

declare var OTSession, OTSessionDelegate, OTPublisher, OTSubscriber, CGRectMake, interop;

export class TNSSession implements TNSSessionI {

    private _apiKey: string;

    private _session: any;
    private _publisher: any;
    private _subscriber: any;

    constructor(apiKey: string) {
        this._apiKey = apiKey;
    }

    /**
     * Creates the Objective-C OTSession object, which represents an existing OpenTok Session
     *
     * @param {string} sessionId The generated OpenTok session id
     */
    public create(sessionId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if(!this._apiKey) {
                console.log('API key not set. Please use the constructor to set the API key');
                reject('API Key Set');
            }
            this._session = new OTSession(this._apiKey, sessionId, frame.topmost().currentPage.ios);
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
                var errorRef = new interop.Reference();
                session.connectWithTokenError(token, errorRef);
                if(errorRef.value) {
                    console.log('Error connecting with token - ' + errorRef.value);
                    reject(errorRef.value);
                }
                else {
                    resolve(true);
                }
            }
        });
    }

    /**
     * Disconnect from an active OpenTok session.
     * This method tears down all OTPublisher and OTSubscriber objects that have been initialized.
     * When the session disconnects, the [OTSessionDelegate sessionDidDisconnect:] message is sent to the session’s delegate.
     *
     * @returns {Promise<any>}
     */
    public disconnect(): Promise<any> {
        return new Promise((resolve, reject) => {
            let session = this._session;
            if(session) {
                try {
                    session.disconnect();
                    resolve(true);
                } catch(error) {
                    console.log(error);
                    reject(error);
                }
            }
        });
    }

    /**
     * Sets up an instance of OTPublisher to use with this session. OTPubilsher
     * binds to the device camera and microphone, and will provide A/V streams
     * to the OpenTok session.
     *
     * @param {number} videoLocationX The X-coordinate position of the video frame
     * @param {number} videoLocationY The Y-coordinate position of the video frame
     * @param {number} videoWidth The width of the video frame (pixels)
     * @param {number} videoHeight The height of the video frame (pixels)
     */
    public publish(videoLocationX: number, videoLocationY: number, videoWidth: number, videoHeight: number) {
        let session = this._session;
        if(session) {
            this._publisher = new OTPublisher(frame.topmost().currentPage.ios);
            try {
                this._session.publish(this._publisher);
            } catch(error) {
                console.log('Failed to publish to session: ' + error);
            }
            if(this._publisher) {
                frame.topmost().currentPage.ios.view.addSubview(this._publisher.view)
                if(!videoLocationX)
                    videoLocationX = 0.0;
                if(!videoLocationY)
                    videoLocationY = 0;
                if(!videoWidth)
                    videoWidth = 100;
                if(!videoHeight)
                    videoHeight = 100;
                this._publisher.view.frame = CGRectMake(videoLocationX, videoLocationY, videoWidth, videoHeight);
            }
        }
    }

    /**
     * Instantiates a subscriber for the given stream and asynchronously begins the
     * process to begin receiving A/V content for this stream. Unlike doPublish,
     * this method does not add the subscriber to the view hierarchy. Instead, we
     * add the subscriber only after it has connected and begins receiving data.
     *
     * @param {any} stream The OTSession stream to subscribe to
     * @returns {Promise<any>}
     */
    public subscribe(stream: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let session = this._session;
            if(session) {
                this._subscriber = new OTSubscriber(stream, frame.topmost().currentPage.ios);
                try {
                    session.subscribe(this._subscriber);
                    resolve(true);
                } catch(error) {
                    console.log('Failed to subscribe to session: ' + error);
                    reject(error);
                }
            }
        });
    }

    /**
     * Cleans the subscriber from the view hierarchy, if any.
     * @returns {Promise<any>}
     */
    public unsubscribe(): Promise<any> {
        return new Promise((resolve, reject) => {
            let subscriber = this._subscriber;
            if(subscriber) {
                if(this._session) {
                    try {
                        this._session.unsubscribe(subscriber);
                        resolve(true);
                    } catch(error) {
                        console.log('Failed to unsubscribe from session: ' + error);
                        reject(error);
                    }
                    subscriber.view.removeFromSuperview();
                    this._subscriber = null;
                }
            }
        });
    }

    /**
     * Cleans up the publisher and its view. At this point, the publisher should not
     * be attached to the session any more.
     */
    public cleanupPublisher() {
        let publisher = this._publisher;
        if(publisher) {
            publisher.view.removeFromSuperview();
            publisher = null;
            // this is a good place to notify the end-user that publishing has stopped.
        }
    }

    /**
     * Cleans the subscriber from the view hierarchy, if any.
     * NB: You do *not* have to call unsubscribe in your controller in response to
     * a streamDestroyed event. Any subscribers (or the publisher) for a stream will
     * be automatically removed from the session during cleanup of the stream.
     */
    public cleanupSubscriber() {
        let subscriber = this._subscriber;
        if(subscriber) {
            subscriber.view.removeFromSuperview();
            subscriber = null;
        }
    }

    // OTSubscriber delegate callbacks

    public subscriberDidConnectToStream(subscriberKit: any) {
        if(this._subscriber) {
            console.log('subscriberDidConnectToStream: ' + subscriberKit);
            let view = this._subscriber.view;
            if(view) {
                view.frame = CGRectMake(0, 100, 100, 100);// Todo - allow for custom positioning?
                frame.topmost().currentPage.ios.addSubview(view);
            }
        }
    }

}