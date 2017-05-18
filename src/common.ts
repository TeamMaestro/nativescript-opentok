import {Observable} from 'data/observable';

export interface TNSOTSessionI {
    /**
     * Creates the OTSession object, which represents an existing OpenTok Session
     *
     * @param {string} sessionId The generated OpenTok session id
     * @returns {Promise<any>}
     */
    initSession(sessionId: string): Promise<any>;
    /**
     * Asynchronously begins the session connect process. Some time later, we will
     * expect a delegate method to call us back with the results of this action.
     *
     * @param {string} token The OpenTok token to join an existing session
     * @param {any} config The configurable options when connecting to a session
     * @returns {Promise<any>}
     */
    connect(token: string, config?: any);
    /**
     * Disconnect from an active OpenTok session.
     * This method tears down all OTPublisher and OTSubscriber objects that have been initialized.
     * When the session disconnects, the [OTSessionDelegate sessionDidDisconnect:] message is sent to the session’s delegate.
     *
     * @returns {Promise<any>}
     */
    disconnect(): Promise<any>;

    sessionEvents: Observable;
    publisherEvents: Observable;
    subscriberEvents: Observable;

    publisher: any;
    subscriber: any;

}

export interface TNSOTPublisherI {
    /**
     * Toggles the visibility state of the publisher video stream
     *
     * @returns {Promise<any>}
     */
    toggleVideo();
    /**
     * Toggles the mute state of the publisher audio stream
     *
     * @returns {Promise<any>}
     */
    toggleAudio();
    /**
     * Sets the visibility state of the publisher video stream
     *
     * @param {boolean} state The visibility state, {true} visible, {false} hidden
     */
    setVideoActive(state: boolean);
    /**
     * Sets the mute state of the publisher audio stream
     *
     * @param {boolean} state The mute state, {true} not muted, {false} muted
     */
    setAudioActive(state: boolean);
    /**
     * Toggles the camera used to publish the video stream
     */
    toggleCameraPosition();

    publisherEvents: Observable;


}

export interface TNSOTSubscriberI {

    subscriberEvents: Observable;

}
export type RENDERSTYLE = "fit | scale | fill";