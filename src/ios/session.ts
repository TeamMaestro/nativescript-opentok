import {Observable} from 'data/observable';

import {TNSOTPublisher} from './publisher';
import {TNSOTSubscriber} from './subscriber';

declare var OTSession: any,
            OTSessionDelegate: any,
            interop: any,
            OTSessionErrorCode: any;

export class TNSOTSession {

    private _apiKey: string;

    private _session: any;
    private _publisher: TNSOTPublisher;
    private _sessionDelegate: TNSSessionDelegate;

    constructor(apiKey: string) {
        this._apiKey = apiKey;
        this._sessionDelegate = new TNSSessionDelegate();
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
    connect(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if(this._session) {
                var errorRef = new interop.Reference();
                this._session.connectWithTokenError(token, errorRef);
                if(errorRef.value) {
                    reject({
                        code: errorRef.value.code,
                        message: this.getOTSessionErrorCodeMessage(errorRef.value.code)
                    });
                }
                else {
                    resolve(this._session);
                }
            }
        });
    }

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

    publish() {
        this._publisher = new TNSOTPublisher();
        this._publisher.publish(this._session);
    }

    /**
     * Converts the OTSessionErrorCode values into meaningful error messages for debugging purposes
     *
     * @private
     * @param {number} code The OpenTok error code reference number
     * @returns Debug error message
     */
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

    // get subscriber(): TNSOTSubscriber {
    //     return this._sessionDelegate.subscriber;
    // }

    // get sessionEvents(): Observable {
    //     return this._sessionDelegate.sessionEvents;
    // }

}

class TNSSessionDelegate extends NSObject {

    public static ObjCProtocols = [OTSessionDelegate];

    private _sessionEvents: Observable
    private _subscriber: TNSOTSubscriber;

    // constructor() {
    //     super();
    //     this._sessionEvents = new Observable();
    // }

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
