import {Observable} from 'data/observable';
import {topmost} from 'ui/frame';
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
    private _sessionDelegate: TNSSessionDelegateImpl;

    public subscriber: TNSOTSubscriber;

    constructor(apiKey: string) {
        this._apiKey = apiKey;
        this._sessionDelegate = TNSSessionDelegateImpl.initWithOwner(new WeakRef(this));
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
            this._session = OTSession.alloc().initWithApiKeySessionIdDelegate(this._apiKey, sessionId, this._sessionDelegate);
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

    disconnect(): void {
        let session = this._session;
        if(session) {
            try {
                session.disconnect();
            } catch(error) {
                console.log(error);
            }
        }
    }

    unpublish(): void {
        let session = this._session;
        try {
            if(session) {
                session.unpublish(this._publisher);
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    unsubscribe(): void {
        let session = this._session;
        try {
            if(session) {
                session.unsubscribe();
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    set publisher(publisher) {
        this._publisher = publisher;
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

    get events(): Observable {
        return this._sessionDelegate.events;
    }

}

class TNSSessionDelegateImpl extends NSObject {

    public static ObjCProtocols = [OTSessionDelegate];

    private _events: Observable
    private _owner: WeakRef<any>;

    public static initWithOwner(owner: WeakRef<any>): TNSSessionDelegateImpl {
        let subscriberKiDelegate = new TNSSessionDelegateImpl();
        subscriberKiDelegate._events = new Observable();
        subscriberKiDelegate._owner = owner;
        return subscriberKiDelegate;
    }

    /**
     * Sent when the client connects to the session.
     *
     * @param {*} session The OTSession instance that sent this message
     */
    sessionDidConnect(session: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'sessionDidConnect',
                object: session
            });
        }
    }

    sessionDidDisconnect(session: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'sessionDidDisconnect',
                object: new Observable(session)
            });
        }
    }

    sessionDidReconnect(session: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'sessionDidReconnect',
                object: new Observable(session)
            });
        }
    }

    sessionDidBeginReconnecting(session: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'sessionDidBeginReconnecting',
                object: new Observable(session)
            });
        }
    }

    sessionStreamCreated(session: any, stream: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'streamCreated',
                object: new Observable({
                    session: session,
                    stream: stream
                })
            });
        }
        let owner = this._owner.get();
        owner.subscriber = new TNSOTSubscriber();
        owner.subscriber.subscribe(session, stream);
    }

    sessionStreamDestroyed(session: any, stream: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'streamDestroyed',
                object: new Observable({
                    session: session,
                    stream: stream
                })
            });
        }
        let view = topmost().currentPage.getViewById('subscriber');
        if(view) {
            // view.ios.removeFromSuperview();
        }
    }

    sessionDidFailWithError(session: any, error: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'didFailWithError',
                object: new Observable({
                    session: session,
                    error: error
                })
            });
        }
    }

    sessionConnectionDestroyed(session: any, connection: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'connectionDestroyed',
                object: new Observable({
                    session: session,
                    connection: connection
                })
            });
        }
    }

    sessionConnectionCreated(session: any, connection: any) {
        if(this._events) {
            this._events.notify({
                eventName: 'connectionCreated',
                object: new Observable({
                    session: session,
                    connection: connection
                })
            });
        }
    }

    sessionArchiveStartedWithId(session:any, archiveId: string, name?: string) {
        if(this._events) {
            this._events.notify({
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
        if(this._events) {
            this._events.notify({
                eventName: 'archiveStoppedWithId',
                object: new Observable({
                    session: session,
                    archiveId: archiveId
                })
            });
        }
    }

    get events(): Observable {
        return this._events;
    }

}
