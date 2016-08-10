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

    private _session: any;
    private _publisher: TNSOTPublisher;
    private _sessionDelegate: TNSSessionDelegate;
    private _config: any;

    constructor(apiKey: string, config?: any) {
        this._apiKey = apiKey;
        this._config = config;
        this._sessionDelegate = new TNSSessionDelegate();
        this._sessionDelegate.initSessionEvents();
    }

    /**
     * Creates the Objective-C OTSession object, which represents an existing OpenTok Session
     *
     * @param {string} sessionId The generated OpenTok session id
     */
    initSession(sessionId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if(!this._apiKey) {
                console.log('API key not set. Please use the constructor to set the API key');
                reject('API Key Set');
            }
            this._session = new OTSession(this._apiKey, sessionId, this._sessionDelegate);
            if(this._session) {
                resolve();
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
     *
     */
    connect(token: string) {
        if(this._session) {
            var errorRef = new interop.Reference();
            this._session.connectWithTokenError(token, errorRef);
            if(errorRef.value) {
               return {
                    code: errorRef.value.code,
                    message: this.getOTSessionErrorCodeMessage(errorRef.value.code)
                };
            }
        }
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
            if(this._session) {
                try {
                    this._session.disconnect();
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
     * @returns {Promise<any>}
     */
    publish() {
        this._publisher = new TNSOTPublisher();
        let config = this._config;
        if(config.publisher) {
            this._publisher.publish(this._session, config.videoLocationX, config.videoLocationY, config.videoWidth, config.videoHeight);
        }
        else {
            this._publisher.publish(this._session);
        }
    }

    private getOTSessionErrorCodeMessage(code: number) {
        switch(code) {
            case OTSessionErrorCode.OTSessionIllegalState:
                return 'A method has been invoked at an illegal or inappropriate time for this session. For example, attempting to connect an already connected session will return this error.';
            case OTSessionErrorCode.OTAuthorizationFailure:
                return 'An invalid API key or token was provided';
            case OTSessionErrorCode.OTErrorInvalidSession:
                return 'An invalid session ID was provided';
            case OTSessionErrorCode.OTSessionConnectionTimeout:
                return 'The connection timed out while attempting to connect to the session.';
            default:
                return 'No message';
        }
    }

    get session(): any {
        return this._session;
    }

    get publisher(): TNSOTPublisher {
        return this._publisher;
    }

    get subscriber(): TNSOTSubscriber {
        return this._sessionDelegate.subscriber;
    }

    get sessionEvents(): Observable {
        return this._sessionDelegate.sessionEvents;
    }

    get publisherEvents(): Observable {
        return this._publisher.publisherEvents;
    }

    get subscriberEvents(): Observable {
        return this._sessionDelegate.subscriber.subscriberEvents;
    }

}

class TNSSessionDelegate extends NSObject {

    public static ObjCProtocols = [OTSessionDelegate];

    private _sessionEvents: Observable
    private _subscriber: TNSOTSubscriber;

    initSessionEvents(emitEvents: boolean = true) {
        if(emitEvents) {
            this._sessionEvents = new Observable();
        }
    }

    sessionDidConnect(session: any) {
        if(this._sessionEvents) {
            this._sessionEvents.notify({
                eventName: 'sessionDidConnect',
                object: new Observable({
                    sessionId: session.sessionId,
                    sessionConnectionStatus: session.sessionConnectionStatus
                })
            });
        }

    }

    sessionDidDisconnect(session: any) {
        if(this._sessionEvents) {
            this._sessionEvents.notify({
                eventName: 'sessionDidDisconnect',
                object: new Observable(session)
            });
        }
    }

    sessionDidReconnect(session: any) {
        if(this._sessionEvents) {
            this._sessionEvents.notify({
                eventName: 'sessionDidReconnect',
                object: new Observable(session)
            });
        }
    }

    sessionDidBeginReconnecting(session: any) {
        if(this._sessionEvents) {
            this._sessionEvents.notify({
                eventName: 'sessionDidBeginReconnecting',
                object: new Observable(session)
            });
        }
    }

    sessionStreamCreated(session: any, stream: any) {
        if(this._sessionEvents) {
            this._sessionEvents.notify({
                eventName: 'streamCreated',
                object: new Observable({
                    session: session,
                    stream: stream
                })
            });
        }
        console.log('session stream created');
        this._subscriber = new TNSOTSubscriber();
        this._subscriber.subscribe(session, stream);
    }

    sessionDidFailWithError(session: any, error: any) {
        if(this._sessionEvents) {
            this._sessionEvents.notify({
                eventName: 'didFailWithError',
                object: new Observable({
                    session: session,
                    error: error
                })
            });
        }
    }

    sessionConnectionDestroyed(session: any, connection: any) {
        if(this._sessionEvents) {
            this._sessionEvents.notify({
                eventName: 'connectionDestroyed',
                object: new Observable({
                    session: session,
                    connection: connection
                })
            });
        }
    }

    sessionConnectionCreated(session: any, connection: any) {
        if(this._sessionEvents) {
            this._sessionEvents.notify({
                eventName: 'connectionCreated',
                object: new Observable({
                    session: session,
                    connection: connection
                })
            });
        }
    }

    sessionArchiveStartedWithId(session:any, archiveId: string, name?: string) {
        if(this._sessionEvents) {
            this._sessionEvents.notify({
                eventName: 'archiveStartedWithId',
                object: new Observable({
                    session: session,
                    archiveId: archiveId,
                    name: name
                })
            });
        }
    }

    sessionArchiveStoppedWithId(session: any, archiveId: string) {
        if(this._sessionEvents) {
            this._sessionEvents.notify({
                eventName: 'archiveStoppedWithId',
                object: new Observable({
                    session: session,
                    archiveId: archiveId
                })
            });
        }
    }

    get sessionEvents(): Observable {
        return this._sessionEvents;
    }

    get subscriber(): TNSOTSubscriber {
        return this._subscriber;
    }

}
