import * as app from 'application';
import {topmost} from 'ui/frame';

import {TNSOTSessionI} from '../common';
import {TNSOTSessionDelegate} from './session-delegate';
import {TNSOTPublisher} from './publisher';

declare var OTSession: any,
            OTSessionDelegate: any,
            OTPublisher: any,
            OTSubscriber: any,
            CGRectMake: any,
            interop: any,
            OTSessionErrorCode: any;

export class TNSOTSession implements TNSOTSessionI {

    private _apiKey: string;
    private _subscriber: any;
    private _delegate: TNSOTSessionDelegate;

    public session: any;
    public publisher: TNSOTPublisher;

    constructor(apiKey: string) {
        this._apiKey = apiKey;
        this.bindSessionEvents(true);
        this.bindPublisherEvents(true);
    }

    /**
     * Creates the Objective-C OTSession object, which represents an existing OpenTok Session
     *
     * @param {string} sessionId The generated OpenTok session id
     */
    create(sessionId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if(!this._apiKey) {
                console.log('API key not set. Please use the constructor to set the API key');
                reject('API Key Set');
            }
            this.session = new OTSession(this._apiKey, sessionId, this._delegate);
            if(this.session) {
                resolve(this.session);
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
    connect(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if(this.session) {
                var errorRef = new interop.Reference();
                this.session.connectWithTokenError(token, errorRef);
                if(errorRef.value) {
                    reject({
                        code: errorRef.value.code,
                        message: this.getOTSessionErrorCodeMessage(errorRef.value.code)
                    });
                }
                else {
                    resolve(this.session);
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
    disconnect(): Promise<any> {
        return new Promise((resolve, reject) => {
            if(this.session) {
                try {
                    this.session.disconnect();
                    resolve();
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
     * @returns {Promise<any>}
     */
    publish(videoLocationX?: number, videoLocationY?: number, videoWidth?: number, videoHeight?: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if(this.session) {
                this.publisher.init(this.session, videoLocationX, videoLocationY, videoWidth, videoHeight).then((result) => {
                    resolve(result);
                }, (error) => {
                    reject(error);
                });
            }
        });
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
	subscribe(stream: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if(this.session) {
                this._subscriber = new OTSubscriber(stream, topmost().currentPage.ios);
                try {
                    this.session.subscribe(this._subscriber);
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
	unsubscribe(): Promise<any> {
        return new Promise((resolve, reject) => {
            let subscriber = this._subscriber;
            if(subscriber) {
                if(this.session) {
                    try {
                        this.session.unsubscribe(subscriber);
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
	cleanupPublisher() {
        let publisher = this.publisher.nativePublisher;
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
	cleanupSubscriber() {
        let subscriber = this._subscriber;
        if(subscriber) {
            subscriber.view.removeFromSuperview();
            subscriber = null;
        }
    }

    // OTSubscriber delegate callbacks

	subscriberDidConnectToStream(subscriberKit: any) {
        if(this._subscriber) {
            console.log('subscriberDidConnectToStream: ' + subscriberKit);
            let view = this._subscriber.view;
            if(view) {
                view.frame = CGRectMake(0, 100, 100, 100);// Todo - allow for custom positioning?
                topmost().currentPage.ios.addSubview(view);
            }
        }
    }


    private getOTSessionErrorCodeMessage(code: number) {
        switch(code) {
            case OTSessionErrorCode.OTSessionIllegalState:// 1015
                return 'A method has been invoked at an illegal or inappropriate time for this session. For example, attempting to connect an already connected session will return this error.';
            case OTSessionErrorCode.OTAuthorizationFailure:// 1004
                return 'An invalid API key or token was provided';
            case OTSessionErrorCode.OTErrorInvalidSession:// 1005
                return 'An invalid session ID was provided';
            case OTSessionErrorCode.OTSessionConnectionTimeout:// 1021
                return 'The connection timed out while attempting to connect to the session.';
            default:
                return 'No message';
        }
    }

    /**
     * Binds the custom session delegate for registering to existing events
     *
     * @param {boolean} [emitEvents=true] Whether to attach a custom event listener
     */
    private bindSessionEvents(emitEvents:boolean = true) {
        this._delegate = new TNSOTSessionDelegate();
        this._delegate.initSession(emitEvents);
    }

    /**
     * Binds the custom publisher delegate for registering to existing events
     *
     * @param {boolean} [emitEvents=true] Whether to attach a custom event listener
     */
    private bindPublisherEvents(emitEvents: boolean = true) {
        this.publisher = new TNSOTPublisher(emitEvents);
    }

    /**
     * Returns the custom session delegate instance
     *
     * @returns {TNSOTSessionDelegate} Custom implementation of OTSessionDelegate
     */
    instance(): TNSOTSessionDelegate {
        return this._delegate;
    }

}
