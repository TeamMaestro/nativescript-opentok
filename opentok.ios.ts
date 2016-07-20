import {Common} from './opentok-common';

declare var OTSession, OTSessionDelegate, OTPublisher, OTSubscriber, CGRectMake, interop;

export class OpenTok {

    public static ObjCProtocols = [OTSessionDelegate];

    private _session: any;
    private _publisher: any;
    private _subscriber: any;
    private _uiview : any;

    /**
     * Creates the Objective-C OTSession object, which represents an existing OpenTok Session
     *
     * @param {string} apiKey The OpenTok api key
     * @param {string} sessionId The generated OpenTok session id
     * @param {*} delegate The UIView reference
     */
    public init(apiKey: string, sessionId: string, delegate: any) {
        this._session = new OTSession(apiKey, sessionId, delegate);
        this._uiview = delegate;
        if(!this._session) {
            console.log('OpenTok initialization failed');
        }
        else {
            console.log('OpenTok initialized: ' + this._session);
        }
    }

    /**
     * Asynchronously begins the session connect process. Some time later, we will
     * expect a delegate method to call us back with the results of this action.
     */
    public doConnect(token: string) {
        let session = this._session;
        if(session) {
            var errorRef = new interop.Reference();
            session.connectWithTokenError(token, errorRef);
            if(errorRef.value) {
                console.log('Error connecting with token - ' + errorRef.value);
            }
        }
    }

    /**
     * Disconnect from an active OpenTok session.
     * This method tears down all OTPublisher and OTSubscriber objects that have been initialized.
     * When the session disconnects, the [OTSessionDelegate sessionDidDisconnect:] message is sent to the session’s delegate.
     */
    public doDisconnect() {
        let session = this._session;
        if(session) {
            try {
                session.disconnect();
            } catch(error) {
                console.log(error);
            }
        }
    }

    /**
     * Sets up an instance of OTPublisher to use with this session. OTPubilsher
     * binds to the device camera and microphone, and will provide A/V streams
     * to the OpenTok session.
     */
    public doPublish(videoLocationX: number, videoLocationY: number, videoWidth: number, videoHeight: number) {
        let session = this._session;
        if(session) {
            this._publisher = new OTPublisher(this._uiview);
            try {
                this._session.publish(this._publisher);
            } catch(error) {
                console.log('Failed to publish to session: ' + error);
            }
            if(this._publisher) {
                this._uiview.view.addSubview(this._publisher.view)
                if(!videoLocationX)
                    videoLocationX = 0.0;
                if(!videoLocationY)
                    videoLocationY = 0;
                if(!videoWidth)
                    videoWidth = 100;
                if(!videoHeight)
                    videoHeight = 100;
                this._publisher.view.frame = CGRectMake(videoLocationX, videoLocationY, videoWidth, videoHeight);
            }
        }
    }

    /**
     * Instantiates a subscriber for the given stream and asynchronously begins the
     * process to begin receiving A/V content for this stream. Unlike doPublish,
     * this method does not add the subscriber to the view hierarchy. Instead, we
     * add the subscriber only after it has connected and begins receiving data.
     */
    public doSubscribe(stream: any, delegate: any) {
        let session = this._session;
        if(session) {
            this._subscriber = new OTSubscriber(stream, delegate);
            try {
                session.subscribe(this._subscriber);
            } catch(error) {
                console.log('Failed to subscribe to session: ' + error);
            }
        }
    }

    /**
     * Cleans the subscriber from the view hierarchy, if any.
     */
    public doUnsubscribe() {
        let subscriber = this._subscriber;
        if(subscriber) {
            if(this._session) {
                try {
                    this._session.unsubscribe(subscriber);
                } catch(error) {
                    console.log('Failed to unsubscribe from session: ' + error);
                }
                subscriber.view.removeFromSuperview();
                this._subscriber = null;
            }
        }
    }

    /**
     * Cleans up the publisher and its view. At this point, the publisher should not
     * be attached to the session any more.
     */
    public cleanupPublisher() {
        let publisher = this._publisher;
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
    public cleanupSubscriber() {
        let subscriber = this._subscriber;
        if(subscriber) {
            subscriber.view.removeFromSuperview();
            subscriber = null;
        }
    }

    public subscriberDidConnectToStream(subscriber: any) {
        console.log('subscriberDidConnectToString: ' + subscriber.stream.connection.connectionId);
        subscriber.view.frame = CGRectMake(0, 100, 100, 100);
        this._uiview.addSubview(subscriber.view);
    }

}