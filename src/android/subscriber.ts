import {Observable} from "data/observable";
import {TNSOTSubscriberListener} from "./subscriber-listener";
declare var com: any, android: any;
/**
 * Created by Osei on 8/19/2016.
 */
export class TNSOTSubscriber{
    private _nativeSubscriber: any;
    private _subscriberListener:any;
    constructor(config?: any) {
        this._subscriberListener = new TNSOTSubscriberListener(true, config);
    }

    subscribe(session: any, stream: any) {

    }

    /**
     * Cleans the subscriber from the view hierarchy, if any.
     *
     * @param {*} session THe session to unsubscribe from
     */
    unsubscribe(session: any) {

    }

    /**
     * Cleans the subscriber from the view hierarchy, if any.
     * NB: You do *not* have to call unsubscribe in your controller in response to
     * a streamDestroyed event. Any subscribers (or the publisher) for a stream will
     * be automatically removed from the session during cleanup of the stream.
     */
    cleanup() {

    }

    toggleVideo() {

    }

    setVideoActive(state: boolean) {

    }

    toggleAudio() {
    }

    setAudioActive(state: boolean) {

    }

    get subscriberEvents(): Observable {
        return this._subscriberListener.subscriberEvents;
    }
}