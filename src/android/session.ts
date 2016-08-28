import {TNSOTSessionI} from '../common';
import {TNSOTPublisher} from './publisher';
import * as app from 'application';
import {Observable} from 'data/observable';
declare var com: any, android: any;

const Session = com.opentok.android.Session;
const Subscriber = com.opentok.android.Subscriber;
const Publisher = com.opentok.android.Publisher;
const BaseVideoRenderer = com.opentok.android.BaseVideoRenderer;
const AbsoluteLayout = android.widget.AbsoluteLayout;
const RelativeLayout = android.widget.RelativeLayout;


const SessionListener = com.opentok.android.Session.SessionListener;
const ReconnectionListener = com.opentok.android.Session.ReconnectionListener;
const ConnectionListener = com.opentok.android.Session.ConnectionListener;
const ArchiveListener = com.opentok.android.Session.ArchiveListener;


export class TNSOTSession {
    private apiKey: string;
    private subscriber: any;
    private config: any;
    public session: any;
    public publisher: any;
    private _sessionEvents;
    constructor(apiKey: string, config: any) {
        this.apiKey = apiKey;
        this.config = config;
    }

    public initSession(sessionId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.apiKey) {
                console.log('API key not set. Please use the constructor to set the API key');
                reject('API Key Set');
            }
            const that = new WeakRef(this);
            this.session = new Session(app.android.context, this.apiKey, sessionId);
            this._sessionEvents = new Observable();
            this.session.setSessionListener(new SessionListener({
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
                    });

                    // this._subscriber = new TNSOTSubscriber(this._config);
                    // this._subscriber.subscribe(session, stream);
                }
            }
        }));
            this.session.setArchiveListener(new ArchiveListener({
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
        }));
            this.session.setConnectionListener(ConnectionListener({
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
        }));
            this.session.setReconnectionListener(ReconnectionListener({
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
        }));
            if (this.session) {
                console.log('OpenTok session: ' + this.session);
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
            let session = this.session;
            if (session) {
                try {
                    session.connect(token);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        });
    }

    public disconnect(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.session.disconnect();
                resolve();
            } catch (err) {
                reject(err)
            }
        });
    }

    public publish(pubInstance:any) {
        if (this.session) {
            this.session.publish(pubInstance);
        }
    }

    public subscribe(stream: any): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('Stream Received: ' + stream);
            if (!this.subscriber) {
                this.subscriber = new Subscriber(app.android.context, stream);
                this.subscriber.setSubscriberListener(app.android.context);
                this.subscriber.getRenderer().setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE,
                    BaseVideoRenderer.STYLE_VIDEO_FILL);
                this.session.subscribe(this.subscriber);
            }
        });
    }

    public unsubscribe(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.session.unsubscribe(this.subscriber);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    get sessionEvents(): Observable {
        return this._sessionEvents;
    }

}