import * as frame from 'ui/frame';
import {Observable, EventData} from 'data/observable';
import {isAndroid, isIOS} from 'platform';
import * as utils from "utils/utils";
import {Page} from 'ui/page';
import * as dialogs from "ui/dialogs";
import {TNSOTSession, TNSOTPublisher, TNSOTSubscriber} from 'nativescript-opentok';
const M = 23;
export class Demo extends Observable {

    public _apiKey:string = '45771112';
    private _sessionId: string = '2_MX40NTc3MTExMn5-MTQ4NzE2NTQxMzkyOH5hakU5RDNCN3JGWDZhTDZ5S1NkVVBGY0h-fg';
    private _publisherToken: string = 'T1==cGFydG5lcl9pZD00NTc3MTExMiZzaWc9NDNjY2I5NTA5NTdjOWM4OWE1NDgzYmNjZTkzNmUxOGRmZTllNTI0ZjpzZXNzaW9uX2lkPTJfTVg0ME5UYzNNVEV4TW41LU1UUTROekUyTlRReE16a3lPSDVoYWtVNVJETkNOM0pHV0RaaFREWjVTMU5rVlZCR1kwaC1mZyZjcmVhdGVfdGltZT0xNDg3MTY1NDUxJm5vbmNlPTAuODgyMzY2OTU5NzkyMTQzNSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDg3NzcwMjUw';
    private _subscriberToken: string = 'T1==cGFydG5lcl9pZD00NTc3MTExMiZzaWc9ZDJlYmU3MTJhZjliNDhlOTUzODdhZGY5ZjAyMDA3MGNmNWZlMjdkYzpzZXNzaW9uX2lkPTJfTVg0ME5UYzNNVEV4TW41LU1UUTROekUyTlRReE16a3lPSDVoYWtVNVJETkNOM0pHV0RaaFREWjVTMU5rVlZCR1kwaC1mZyZjcmVhdGVfdGltZT0xNDg3MTY1NDc3Jm5vbmNlPTAuMTEyODQ5MTE3Mjg2MTcyOTcmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ4Nzc3MDI3Nw==';
    private publisher: TNSOTPublisher;
    private subscriber: TNSOTSubscriber;

    private session: TNSOTSession;

    constructor(private page: Page) {
        super();
        this.session = TNSOTSession.initWithApiKeySessionId(this._apiKey, this._sessionId);
        this.publisher = <TNSOTPublisher> this.page.getViewById('publisher');
        this.subscriber = <TNSOTSubscriber> this.page.getViewById('subscriber');
        this.session.subscriber = this.subscriber;
        this.publisher.events.on('streamCreated',(data:any)=>{
            this.subscriber.subscribe(this.session,data.object.stream);
        });
        this.session.events.on('signalReceived',(data:any)=>{
            console.dump(data);
        });        
    }

    publish() {
        if(isAndroid){
            if(android.os.Build.VERSION.SDK_INT >= M){
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

    subscriberConnect(){
        this.session.connect(this._subscriberToken);
    }

    disconnect() {
        this.session.disconnect();
    }

    sendSignal() {
        this.session.sendSignal('chat', 'hello');
    }

}