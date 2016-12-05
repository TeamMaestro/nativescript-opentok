import {TNSOTSessionI} from '../common';
import {TNSOTPublisher} from './publisher';
import * as app from 'application';
import {Observable} from 'data/observable';
import * as utils from "utils/utils";
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
    private options: any;

    /*
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
     else {}
     }

     */
    public static initWithApiKeySessionId(apiKey: string, sessionId: string) {
        let tnsSession = new TNSOTSession();
        tnsSession._sessionEvents = new Observable();
        tnsSession.apiKey = apiKey;
        tnsSession.session = new Session(utils.ad.getApplicationContext(), apiKey, sessionId);
        tnsSession.session.setSessionListener(new SessionListener({
            onConnected(session: any) {
                if (tnsSession._sessionEvents) {
                    tnsSession._sessionEvents.notify({
                        eventName: 'sessionDidConnect',
                        object: new Observable({
                            session: session
                        })
                    });
                }
            },
            onDisconnected(session: any) {
                if (tnsSession._sessionEvents) {
                    tnsSession._sessionEvents.notify({
                        eventName: 'sessionDidDisconnect',
                        object: new Observable({
                            session: session
                        })
                    });
                }
            },
            onError(session: any, error: any) {
                if (tnsSession._sessionEvents) {
                    tnsSession._sessionEvents.notify({
                        eventName: 'didFailWithError',
                        object: new Observable({
                            session: session,
                            error: error
                        })
                    });
                }
            },
            onStreamDropped(session: any, stream: any) {
                if (tnsSession._sessionEvents) {
                    tnsSession._sessionEvents.notify({
                        eventName: 'streamDestroyed',
                        object: new Observable({
                            session: session,
                            stream: stream
                        })
                    })
                }
            },
            onStreamReceived(session: any, stream: any) {
                if (tnsSession._sessionEvents) {
                    tnsSession._sessionEvents.notify({
                        eventName: 'streamCreated',
                        object: new Observable({
                            session: session,
                            stream: stream
                        })
                    });
                }
            }
        }));
        tnsSession.session.setArchiveListener(new ArchiveListener({
            onArchiveStarted(session: any, id: any, name: any) {
                if (tnsSession._sessionEvents) {
                    tnsSession._sessionEvents.notify({
                        eventName: 'archiveStartedWithId',
                        object: new Observable({
                            session: session,
                            archiveId: id,
                            name: name
                        })
                    });
                }
            }, onArchiveStopped(session: any, id: any) {
                if (tnsSession._sessionEvents) {
                    tnsSession._sessionEvents.notify({
                        eventName: 'archiveStoppedWithId',
                        object: new Observable({
                            session: session,
                            archiveId: id
                        })
                    });
                }
            }
        }));
        tnsSession.session.setConnectionListener(new ConnectionListener({
            onConnectionCreated(session: any, connection: any) {
                if (tnsSession._sessionEvents) {
                    tnsSession._sessionEvents.notify({
                        eventName: 'connectionCreated',
                        object: new Observable({
                            session: session,
                            connection: connection
                        })
                    })
                }
            },
            onConnectionDestroyed(session: any, connection: any) {
                if (tnsSession._sessionEvents) {
                    tnsSession._sessionEvents.notify({
                        eventName: 'connectionDestroyed',
                        object: new Observable({
                            session: session,
                            connection: connection
                        })
                    })
                }
            }
        }));
        tnsSession.session.setReconnectionListener(new ReconnectionListener({
            onReconnected(session) {
                if (tnsSession._sessionEvents) {
                    tnsSession._sessionEvents.notify({
                        eventName: 'sessionDidReconnect',
                        object: new Observable({
                            session: session
                        })
                    })
                }
            }, onReconnecting(session) {
                if (tnsSession._sessionEvents) {
                    tnsSession._sessionEvents.notify({
                        eventName: 'sessionDidBeginReconnecting',
                        object: new Observable({
                            session: session
                        })
                    })
                }
            }
        }));
        return tnsSession;
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

    public subscribe(subInstance: any) {
        this.session.subscribe(subInstance);
    }

    get sessionEvents(): Observable {
        return this._sessionEvents;
    }

    get events(): Observable {
        return this._sessionEvents;
    }

}