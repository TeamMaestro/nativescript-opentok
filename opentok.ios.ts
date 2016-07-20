import {Common} from './opentok-common';

declare var OTSession, OTPublisher, OTSubscriber, CGRect;

export class OpenTok extends Common {

    public session: any;
    public publisher: any;
    public subscriber: any;

    init(apiKey: string, sessionId: string, delegate: any) {
        this.session = new OTSession(apiKey, sessionId, delegate);
        if(!this.session) {
            console.log('OpenTok initialization failed');
        }
        else {
            console.log('OpenTok initialized: ' + this.session);
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
                console.log(error);
            }
        }
    }

    /**
     * Sets up an instance of OTPublisher to use with this session. OTPubilsher
     * binds to the device camera and microphone, and will provide A/V streams
     * to the OpenTok session.
     */
    doPublish(delegate: any, videoLocationX: number, videoLocationY: number, videoWidth: number, videoHeight: number) {
        let session = this.session;
        if(session) {
            this.publisher = new OTPublisher(delegate);
            try {
                this.session.publish(this.publisher);
            } catch(error) {
                console.log('Failed to publish to session: ' + error);
            }
            if(this.publisher) {
                // view.addSubview(publisher!.view)
                if(!videoLocationX)
                    videoLocationX = 0.0;
                if(!videoLocationY)
                    videoLocationY = 0;
                if(!videoWidth)
                    videoWidth = 100;
                if(!videoHeight)
                    videoHeight = 100;
                this.publisher.view.frame = CGRect(videoLocationX, videoLocationY, videoWidth, videoHeight);
            }
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
                subscriber.view.removeFromSuperview();
                this.subscriber = null;
            }
        }
    }

    /**
     * Cleans up the publisher and its view. At this point, the publisher should not
     * be attached to the session any more.
     */
    cleanupPublisher() {
        let publisher = this.publisher;
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
    cleanupSubscriber() {
        let subscriber = this.subscriber;
        if(subscriber) {
            subscriber.view.removeFromSuperview();
            subscriber = null;
        }
    }

}