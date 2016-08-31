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
const MARSHMALLOW = 23;
const currentapiVersion = android.os.Build.VERSION.SDK_INT;

import permissions = require('nativescript-permissions');
export class TNSOTSession {
    private apiKey: string;
    private subscriber: any;
    private config: any;
    public session: any;
    public publisher: any;
    private _sessionEvents: Observable;
    private options:any;
    constructor(apiKey: string, config: any, options?: any) {
        this.apiKey = apiKey;
        this.config = config;
        this._sessionEvents = new Observable();
        this.options = options;
        /*if (currentapiVersion >= MARSHMALLOW) {

            const perms = [android.Manifest.permission.CAMERA, android.Manifest.permission.RECORD_AUDIO, android.Manifest.permission.MODIFY_AUDIO_SETTINGS, android.Manifest.permission.BLUETOOTH, android.Manifest.permission.BROADCAST_STICKY];
            if (options && options.explanation) {
                permissions.requestPermission(perms, this.options.explanation)
                    .then(function () {

                    })
                    .catch(function (ex) {

                    });
            } else {
                permissions.requestPermission(perms)
                    .then(function () {

                    })
                    .catch(function (ex) {

                    });
            }
        }
        else {}*/
    }

    public initSession(sessionId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.apiKey) {
                console.log('API key not set. Please use the constructor to set the API key');
                reject('API Key Set');
            }
                const that = new WeakRef(this);
                this.session = new Session(app.android.context, this.apiKey, sessionId);
                this.session.setSessionListener(new SessionListener({
                    owner: that.get(),
                    onConnected(session: any) {
                        if (this.owner._sessionEvents) {
                            this.owner._sessionEvents.notify({
                                eventName: 'sessionDidConnect',
                                object: new Observable({
                                    sessionId: session.getSessionId(),
                                    sessionConnectionStatus: null
                                })
                            });
                        }
                    },
                    onDisconnected(session: any) {
                        if (this.owner._sessionEvents) {
                            this.owner._sessionEvents.notify({
                                eventName: 'sessionDidDisconnect',
                                object: this.owner,
                                session: session
                            });
                        }
                    },
                    onError(session: any, error: any) {
                        if (this.owner._sessionEvents) {
                            this.owner._sessionEvents.notify({
                                eventName: 'didFailWithError',
                                object: this.owner,
                                session: session,
                                error: error
                            });
                        }
                    },
                    onStreamDropped(session: any, stream: any) {
                        if (this.owner._sessionEvents) {
                            this.owner._sessionEvents.notify({
                                eventName: 'streamDestroyed',
                                object: this.owner,
                                session: session,
                                stream: stream
                            })
                        }
                    },
                    onStreamReceived(session: any, stream: any) {
                        if (this.owner._sessionEvents) {
                            this.owner._sessionEvents.notify({
                                eventName: 'streamCreated',
                                object: this.owner,
                                session: session,
                                stream: stream

                            });
                        }
                    }
                }));
                this.session.setArchiveListener(new ArchiveListener({
                    owner: that.get(),
                    onArchiveStarted(session: any, id: any, name: any) {
                        if (this.owner._sessionEvents) {
                            this.owner._sessionEvents.notify({
                                eventName: 'archiveStartedWithId',
                                object: this.owner,
                                session: session,
                                archiveId: id,
                                name: name
                            });
                        }
                    }, onArchiveStopped(session: any, id: any) {
                        if (this.owner._sessionEvents) {
                            this.owner._sessionEvents.notify({
                                eventName: 'archiveStoppedWithId',
                                object: this.owner,
                                session: session,
                                archiveId: id

                            });
                        }
                    }
                }));
                this.session.setConnectionListener(new ConnectionListener({
                    owner: that.get(),
                    onConnectionCreated(session: any, connection: any) {
                        if (this.owner._sessionEvents) {
                            this.owner._sessionEvents.notify({
                                eventName: 'connectionCreated',
                                object: this.owner,
                                session: session,
                                connection: connection
                            })
                        }
                    },
                    onConnectionDestroyed(session: any, connection: any) {
                        if (this.owner._sessionEvents) {
                            this.owner._sessionEvents.notify({
                                eventName: 'connectionDestroyed',
                                object: this.owner,
                                session: session,
                                connection: connection
                            })
                        }
                    }
                }));
                this.session.setReconnectionListener(new ReconnectionListener({
                    owner: that.get(),
                    onReconnected(session) {
                        if (this.owner._sessionEvents) {
                            this.owner._sessionEvents.notify({
                                eventName: 'sessionDidReconnect',
                                object: this.owner,
                                session: session
                            })
                        }
                    }, onReconnecting(session) {
                        if (this.owner._sessionEvents) {
                            this.owner._sessionEvents.notify({
                                eventName: 'sessionDidBeginReconnecting',
                                object: this.owner,
                                session: session
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

    public publish(pubInstance: any) {
        if (this.session) {
            this.session.publish(pubInstance);
        }
    }

    public subscribe(subInstance: any) {
        this.session.subscribe(subInstance);
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