import { Observable, fromObject } from 'tns-core-modules/data/observable';
import { topmost } from 'tns-core-modules/ui/frame';
import { TNSOTPublisher } from './publisher';
import { TNSOTSubscriber } from './subscriber';

declare var OTSession: any,
    OTSessionDelegate: any,
    interop: any,
    OTSessionErrorCode: any;

export class TNSOTSession extends NSObject {

    public static ObjCProtocols = [OTSessionDelegate];

    public _ios: any;

    private _events: Observable;
    private _subscriber: TNSOTSubscriber;

    public static initWithApiKeySessionId(apiKey: string, sessionId: string): TNSOTSession {
        let instance = <TNSOTSession>TNSOTSession.new();
        instance._events = fromObject({});
        instance._ios = OTSession.alloc().initWithApiKeySessionIdDelegate(apiKey.toString(), sessionId.toString(), instance);
        return instance;
    }

    public static requestPermission(): any {
    }

    connect(token: string): void {
        let errorRef = new interop.Reference();
        this._ios.connectWithTokenError(token, errorRef);
        if (errorRef.value) {
            console.log(errorRef.value);
        }
    }

    disconnect(): void {
        if (this._ios) {
            try {
                let errorRef = new interop.Reference();
                this._ios.disconnect(errorRef);
                if (errorRef.value) {
                    console.log(errorRef.value);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    sendSignal(type: string, message: string): void {
        if (this._ios) {
            try {
                let errorRef = new interop.Reference();
                this._ios.signalWithTypeStringConnectionError(type, message, null, errorRef);
                if (errorRef.value) {
                    console.log(errorRef.value);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    unsubscribe(subscriber: any): void {
        try {
            if (this._ios) {
                let errorRef = new interop.Reference();
                this._ios.unsubscribe(subscriber, errorRef);
                if (errorRef.value) {
                    console.log(errorRef.value);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    set subscriber(subscriber) {
        this._subscriber = subscriber;
    }

    get events(): Observable {
        return this._events;
    }

    sessionDidConnect(session: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'sessionDidConnect',
                object: fromObject({
                    session: session
                })
            });
        }
    }

    sessionDidDisconnect(session: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'sessionDidDisconnect',
                object: fromObject({
                    session: session
                })
            });
        }
    }

    sessionDidReconnect(session: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'sessionDidReconnect',
                object: fromObject({
                    session: session
                })
            });
        }
    }

    sessionDidBeginReconnecting(session: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'sessionDidBeginReconnecting',
                object: fromObject({
                    session: session
                })
            });
        }
    }

    sessionStreamCreated(session: any, stream: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'streamCreated',
                object: fromObject({
                    session: session,
                    stream: stream
                })
            });
        }
        if (this._subscriber) {
            this._subscriber.subscribe(session, stream);
        }
    }

    sessionStreamDestroyed(session: any, stream: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'streamDestroyed',
                object: fromObject({
                    session: session,
                    stream: stream
                })
            });
        }
    }

    sessionDidFailWithError(session: any, error: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'didFailWithError',
                object: fromObject({
                    session: session,
                    error: error
                })
            });
        }
    }

    sessionConnectionDestroyed(session: any, connection: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'connectionDestroyed',
                object: fromObject({
                    session: session,
                    connection: connection
                })
            });
        }
    }

    sessionConnectionCreated(session: any, connection: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'connectionCreated',
                object: fromObject({
                    session: session,
                    connection: connection
                })
            });
        }
    }

    sessionArchiveStartedWithId(session: any, archiveId: string, name?: string) {
        if (this.events) {
            this.events.notify({
                eventName: 'archiveStartedWithId',
                object: fromObject({
                    session: session,
                    archiveId: archiveId,
                    name: name
                })
            });
        }
    }

    sessionArchiveStoppedWithId(session: any, archiveId: string) {
        if (this.events) {
            this.events.notify({
                eventName: 'archiveStoppedWithId',
                object: fromObject({
                    session: session,
                    archiveId: archiveId
                })
            });
        }
    }

    sessionReceivedSignalTypeFromConnectionWithString(session: any, type: any, connection: any, data: any) {
        if (this.events) {
            this.events.notify({
                eventName: 'signalReceived',
                object: fromObject({
                    session: session,
                    type: type,
                    data: data,
                    connection: connection
                })
            });
        }
    }

}
