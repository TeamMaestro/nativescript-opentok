import {Common} from './opentok-common';

declare var OTSession, OTPublisher, OTSubscriber;

export class OpenTok extends Common {

    public session: any;
    public publisher: any;
    public subscriber: any;

    init(apiKey: string, sessionId: string, delegate: any) {
        this.session = new OTSession(apiKey, sessionId, delegate);
        if(!this.session) {
            console.log('OpenTok initialization failed');
        }
    }

    /**
     * Asynchronously begins the session connect process. Some time later, we will
     * expect a delegate method to call us back with the results of this action.
     */
    doConnect(token: string) {
        let session = this.session;
        if(session) {
            try {
                session.connectWithToken(token);
            } catch(error) {
                console.log('Failed to connect to session with token: ' + token + ', error: ' + error);
            }
        }
    }

    /**
     * Sets up an instance of OTPublisher to use with this session. OTPubilsher
     * binds to the device camera and microphone, and will provide A/V streams
     * to the OpenTok session.
     */
    doPublish(delegate: any) {
        let session = this.session;
        if(session) {
            this.publisher = new OTPublisher(delegate);
            try {
                this.session.publish(this.publisher);
            } catch(error) {
                console.log('Failed to publish to session: ' + error);
            }
            // view.addSubview(publisher!.view)
            // publisher!.view.frame = CGRect(x: 0.0, y: 0, width: videoWidth, height: videoHeight)
        }
    }

    /**
     * Instantiates a subscriber for the given stream and asynchronously begins the
     * process to begin receiving A/V content for this stream. Unlike doPublish,
     * this method does not add the subscriber to the view hierarchy. Instead, we
     * add the subscriber only after it has connected and begins receiving data.
     */
    doSubscribe(stream: any, delegate: any) {
        let session = this.session;
        if(session) {
            this.subscriber = new OTSubscriber(stream, delegate);
            try {
                session.subscribe(this.subscriber);
            } catch(error) {
                console.log('Failed to subscribe to session: ' + error);
            }
        }
    }

    /**
     * Cleans the subscriber from the view hierarchy, if any.
     */
    doUnsubscribe() {
        let subscriber = this.subscriber;
        if(subscriber) {
            if(this.session) {
                try {
                    this.session.unsubscribe(subscriber);
                } catch(error) {
                    console.log('Failed to unsubscribe from session: ' + error);
                }
                // subscriber.view.removeFromSuperview()
                this.subscriber = null;
            }
        }
    }

}