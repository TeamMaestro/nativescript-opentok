export interface TNSOTSessionI {
    /**
     * Creates the OTSession object, which represents an existing OpenTok Session
     *
     * @param {string} sessionId The generated OpenTok session id
     * @returns {Promise<any>}
     */
    create(sessionId: string): Promise<any>;
    /**
     * Asynchronously begins the session connect process. Some time later, we will
     * expect a delegate method to call us back with the results of this action.
     *
     * @param {string} token The OpenTok token to join an existing session
     * @returns {Promise<any>}
     */
    connect(token: string): Promise<any>;
    /**
     * Disconnect from an active OpenTok session.
     * This method tears down all OTPublisher and OTSubscriber objects that have been initialized.
     * When the session disconnects, the [OTSessionDelegate sessionDidDisconnect:] message is sent to the session’s delegate.
     *
     * @returns {Promise<any>}
     */
    disconnect(): Promise<any>;
    /**
     * Instantiates a subscriber for the given stream and asynchronously begins the
     * process to begin receiving A/V content for this stream. Unlike doPublish,
     * this method does not add the subscriber to the view hierarchy. Instead, we
     * add the subscriber only after it has connected and begins receiving data.
     *
     * @param {any} stream The OTSession stream to subscribe to
     * @returns {Promise<any>}
     */
    subscribe(stream: any): Promise<any>;
    /**
     * Cleans the subscriber from the view hierarchy, if any.
     * @returns {Promise<any>}
     */
    unsubscribe(): Promise<any>;

    instance(): any;

    publisher(): any;


}

export interface TNSOTPublisherI {
    /**
     * Toggles the visibility state of the publisher video stream
     *
     * @returns {Promise<any>}
     */
    toggleVideo(): Promise<any>;
    /**
     * Toggles the mute state of the publisher audio stream
     *
     * @returns {Promise<any>}
     */
    toggleAudio(): Promise<any>;
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

    instance(): any;


}