import { Observable } from 'data/observable';
export interface TNSOTSessionI {
    initSession(sessionId: string): Promise<any>;
    connect(token: string, config?: any): any;
    disconnect(): Promise<any>;
    sessionEvents: Observable;
    publisherEvents: Observable;
    subscriberEvents: Observable;
    publisher: any;
    subscriber: any;
}
export interface TNSOTPublisherI {
    toggleVideo(): any;
    toggleAudio(): any;
    setVideoActive(state: boolean): any;
    setAudioActive(state: boolean): any;
    toggleCameraPosition(): any;
    publisherEvents: Observable;
}
export interface TNSOTSubscriberI {
    subscriberEvents: Observable;
}
