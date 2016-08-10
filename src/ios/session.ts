import {Observable} from 'data/observable';

import {TNSOTSessionI} from '../common';
import {TNSOTPublisher} from './publisher';
import {TNSOTSubscriber} from './subscriber';

declare var OTSession: any,
            OTSessionDelegate: any,
            OTPublisher: any,
            OTSubscriber: any,
            CGRectMake: any,
            interop: any,
            OTSubscriberKitDelegate: any,
            OTPublisherKitDelegate: any,
            OTSessionErrorCode: any;

export class TNSOTSession implements TNSOTSessionI {

    private _apiKey: string;

    private _sessionDelegate;
    private _publisher: TNSOTPublisher;
    private _subscriber: TNSOTSubscriber;

    private _sessionEvents: Observable;

    public session: any;

    constructor(apiKey: string) {
        this._apiKey = apiKey;
        this._sessionEvents = new Observable();
        this.registerSessionDelegate();
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
            this.session = OTSession.alloc().initWithApiKeySessionIdDelegate(this._apiKey, sessionId, this._sessionDelegate);
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
    publish(videoLocationX?: number, videoLocationY?: number, videoWidth?: number, videoHeight?: number) {
        this._publisher = new TNSOTPublisher();
        this._publisher.publish(this.session, videoLocationX, videoLocationY, videoWidth, videoHeight);
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

    private registerSessionDelegate() {
        this._sessionDelegate = NSObject.extend({
            sessionDidConnect(session: any) {
                // this._sessionEvents.notify({
                //     eventName: 'sessionDidConnect',
                //     object: null
                // });
            },
            sessionDidDisconnect(session: any) {
                this._sessionEvents.notify({
                    eventName: 'sessionDidDisconnect',
                    object: new Observable(session)
                });
            },
            sessionDidReconnect(session: any) {
                this._sessionEvents.notify({
                    eventName: 'sessionDidReconnect',
                    object: new Observable(session)
                });
            },
            sessionDidBeginReconnecting(session: any) {
                this._sessionEvents.notify({
                    eventName: 'sessionDidBeginReconnecting',
                    object: new Observable(session)
                });
            },
            sessionStreamCreated(session: any, stream: any) {
                this._sessionEvents.notify({
                    eventName: 'streamCreated',
                    object: new Observable({
                        session: session,
                        stream: stream
                    })
                });
                this._subscriber = new TNSOTSubscriber();
                this._subscriber.subscribe(session, stream);
            },
            sessionDidFailWithError(session: any, error: any) {
                this._sessionEvents.notify({
                    eventName: 'didFailWithError',
                    object: new Observable({
                        session: session,
                        error: error
                    })
                });
            },
            sessionConnectionDestroyed(session: any, connection: any) {
                if(this.sessionEvents) {
                    this.sessionEvents.notify({
                        eventName: 'connectionDestroyed',
                        object: new Observable({
                            session: session,
                            connection: connection
                        })
                    });
                }
            },
            sessionConnectionCreated(session: any, connection: any) {
                if(this.sessionEvents) {
                    this.sessionEvents.notify({
                        eventName: 'connectionCreated',
                        object: new Observable({
                            session: session,
                            connection: connection
                        })
                    });
                }
            },
            sessionArchiveStartedWithId(session:any, archiveId: string, name?: string) {
                if(this.sessionEvents) {
                    this.sessionEvents.notify({
                        eventName: 'archiveStartedWithId',
                        object: new Observable({
                            session: session,
                            archiveId: archiveId,
                            name: name
                        })
                    });
                }
            },
            sessionArchiveStoppedWithId(session: any, archiveId: string) {
                if(this.sessionEvents) {
                    this.sessionEvents.notify({
                        eventName: 'archiveStoppedWithId',
                        object: new Observable({
                            session: session,
                            archiveId: archiveId
                        })
                    });
                }
            }
        }, {
            protocols: [OTSessionDelegate]
        });
    }

    get publisher(): TNSOTPublisher {
        return this._publisher;
    }

    get subscriber(): TNSOTSubscriber {
        return this._subscriber;
    }

    get sessionEvents(): Observable {
        return this._sessionEvents;
    }

    get publisherEvents(): Observable {
        return this._publisher.publisherEvents;
    }

    get subscriberEvents(): Observable {
        return this._subscriber.subscriberEvents;
    }

}
