import * as frame from 'ui/frame';
import {Observable, EventData} from 'data/observable';
import {isAndroid, isIOS} from 'platform';
import {Page} from 'ui/page';
import * as dialogs from "ui/dialogs";
import {TNSOTSession, TNSOTPublisher, TNSOTSubscriber} from 'nativescript-opentok';

export class Demo extends Observable {

    public _apiKey:string = '45755172';
    private _sessionId: string = '2_MX40NTc1NTE3Mn5-MTQ4NTI3OTk1NjYyMn5SNHdFbjJ6OEcrQjdGcFRzaGQ5YkxWWWJ-fg';
    private _publisherToken: string = 'T1==cGFydG5lcl9pZD00NTc1NTE3MiZzaWc9YzNmYWVlOWRiN2M2YmMwNWE3NWQ0NThjOTcwNmJhNWU0ZjgxN2Y3MzpzZXNzaW9uX2lkPTJfTVg0ME5UYzFOVEUzTW41LU1UUTROVEkzT1RrMU5qWXlNbjVTTkhkRmJqSjZPRWNyUWpkR2NGUnphR1E1WWt4V1dXSi1mZyZjcmVhdGVfdGltZT0xNDg1Mjg0NjY5Jm5vbmNlPTAuMTUyMzY4ODc2NDg3MjEyODcmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ4Nzg3NjY2Nw==';

    private publisher: TNSOTPublisher;
    private subscriber: TNSOTSubscriber;

    private session: TNSOTSession;

    constructor(private page: Page) {
        super();
        this.session = TNSOTSession.initWithApiKeySessionId(this._apiKey, this._sessionId);
        this.publisher = <TNSOTPublisher> this.page.getViewById('publisher');
        this.subscriber = <TNSOTSubscriber> this.page.getViewById('subscriber');
        this.session.subscriber = this.subscriber;
    }

    publish() {
        if(isAndroid){
            TNSOTSession.requestPermission().then((granted)=>{
                this.session.connect(this._publisherToken);
                this.publisher.publish(this.session, '', 'HIGH', '30');
            },(e)=>{
                if(e && e["android.permission.CAMERA"]){
                    dialogs.alert({
                        title:"Permission Required",
                        message:"This is required to broadcast your video feed.",
                        okButtonText:"OK"
                    })
                }

                if(e && e["android.permission.RECORD_AUDIO"]){
                    dialogs.alert({
                        title:"Permission Required",
                        message:"This is required to broadcast your audio feed.",
                        okButtonText:"OK"
                    })
                }
            });
        }else{
            this.session.connect(this._publisherToken);
            this.publisher.publish(this.session, '', 'HIGH', '30');
        }

    }

    switchCamera() {
        this.publisher.cycleCamera();
    }

    toggleVideo() {
        this.publisher.toggleCamera()
    }

    toggleMute() {
        this.publisher.toggleMute();
    }

    unpublish() {
        this.publisher.unpublish(this.session);
    }

    unsubscribe() {
        this.subscriber.unsubscribe(this.session);
    }

    disconnect() {
        this.session.disconnect();
    }

}