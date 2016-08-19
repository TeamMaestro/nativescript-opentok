import {Observable, EventData} from 'data/observable';
import * as app from 'application';

declare var com: any;

const SessionListener = com.opentok.android.Session.SessionListener;
const ReconnectionListener = com.opentok.android.Session.ReconnectionListener;
const ConnectionListener = com.opentok.android.Session.ConnectionListener;
const ArchiveListener = com.opentok.android.Session.ArchiveListener;
export class TNSSessionListener {

    public sessionEvents: Observable;
    private _sListener: any;
    private _rListener: any;
    private _cListener: any;
    private _aListener: any;
    private sessionDidConnectEvent: EventData;
    constructor(emitEvents?: boolean) {
        if (emitEvents) {
            this.setupEvents();
        }
    }

    get sListener() {
        return this._sListener;
    }
    get rListener() {
        return this._rListener;
    }
    get cListener() {
        return this._cListener;
    }
    get aListener() {
        return this._aListener;
    }

    private setupEvents() {
        this.sessionEvents = new Observable();
        const that = new WeakRef(this);
        this._sListener = new com.opentok.android.Session.SessionListener({
            owner: that.get(),
            /**
             * Invoked when the client connects to the OpenTok session.
             *
             * @param {*} session The session your client connected to.
             */
            onConnected(session: any) {
                if (this.owner.sessionEvents) {
                    this.owner.sessionEvents.notify({
                        eventName: 'sessionDidConnect',
                        object: new Observable({
                            sessionId: session.getSessionId(),
                            sessionConnectionStatus: null
                        })
                    });
                }
            },
            /**
             * Invoked when the client is no longer connected to the OpenTok session.
             *
             * @param {*} session The session your client disconnected from.
             */
            onDisconnected(session: any) {
                if (this.owner.sessionEvents) {
                    this.owner.sessionEvents.notify({
                        eventName: 'sessionDidDisconnect',
                        object: new Observable(session)
                    });
                }
            },
            /**
             * Invoked when something goes wrong when connecting or connected to the session.
             * After this method is invoked, the Session should be treated as dead and unavailable.
             * Do not attempt to reconnect or to call other methods of the Session object.
             *
             * @param {*} session The session in which the error occured.
             * @param {*} error An error describing the cause for error.
             */
            onError(session: any, error: any) {
                if (this.owner.sessionEvents) {
                    this.owner.sessionEvents.notify({
                        eventName: 'didFailWithError',
                        object: new Observable({
                            session: session,
                            error: error
                        })
                    });
                }
            },
            /**
             * Invoked when another client stops publishing a stream to this OpenTok session.
             *
             * @param {*} session The session from which the stream was removed.
             * @param {*} stream A Stream object representing the dropped stream, which can be used to identify a Subscriber.
             */
            onStreamDropped(session: any, stream: any) {
                if (this.owner.sessionEvents) {
                    this.owner.sessionEvents.notify({
                        eventName: 'streamDestroyed',
                        object: new Observable({
                            session: session,
                            stream: stream
                        })
                    })
                }
            },
            /**
             * Invoked when a there is a new stream published by another client in this OpenTok session.
             *
             * @param {*} session The session in which the stream was added.
             * @param {*} stream A Stream object representing the new stream, which can be used to create a Subscriber.
             */
            onStreamReceived(session: any, stream: any) {
                if (this.owner.sessionEvents) {
                    this.owner.sessionEvents.notify({
                        eventName: 'streamCreated',
                        object: new Observable({
                            session: session,
                            stream: stream
                        })
                    })

                    // this._subscriber = new TNSOTSubscriber(this._config);
                    // this._subscriber.subscribe(session, stream);
                }
            }
        });

        this._rListener = new ReconnectionListener({
            owner: that.get(),
            onReconnected(session) {
                if (this.owner.sessionEvents) {
                    this.owner.sessionEvents.notify({
                        eventName: 'sessionDidReconnect',
                        object: new Observable(session)
                    })
                }
            }, onReconnecting(session) {
                if (this.owner.sessionEvents) {
                    this.owner.sessionEvents.notify({
                        eventName: 'sessionDidBeginReconnecting',
                        object: new Observable(session)
                    })
                }
            }
        });

        this._cListener = new ConnectionListener({
            owner: that.get(),
            onConnectionCreated(session: any, connection: any) {
                if (this.owner.sessionEvents) {
                    this.owner.sessionEvents.notify({
                        eventName: 'connectionCreated',
                        object: new Observable({
                            session: session,
                            connection: connection
                        })
                    })
                }
            },
            onConnectionDestroyed(session: any, connection: any) {
                if (this.owner.sessionEvents) {
                    this.owner.sessionEvents.notify({
                        eventName: 'connectionDestroyed',
                        object: new Observable({
                            session: session,
                            connection: connection
                        })
                    })
                }
            }
        });

        this._aListener = new ArchiveListener({
            owner: that.get(),
            onArchiveStarted(session: any, id: any, name: any) {
                if (this.owner.sessionEvents) {
                    this.owner.sessionEvents.notify({
                        eventName: 'archiveStartedWithId',
                        object: new Observable({
                            session: session,
                            archiveId: id,
                            name: name
                        })
                    });
                }
            }, onArchiveStopped(session: any, id: any) {
                if (this.owner.sessionEvents) {
                    this.owner.sessionEvents.notify({
                        eventName: 'archiveStoppedWithId',
                        object: new Observable({
                            session: session,
                            archiveId: id
                        })
                    });
                }
            }
        });
    }

}