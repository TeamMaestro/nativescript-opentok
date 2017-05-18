import * as frame from 'ui/frame';
import {Observable, EventData} from 'data/observable';
import {isAndroid, isIOS} from 'platform';
import * as utils from "utils/utils";
import {Page} from 'ui/page';
import * as dialogs from "ui/dialogs";
import {TNSOTSession, TNSOTPublisher, TNSOTSubscriber} from 'nativescript-opentok';
const M = 23;
export class Demo extends Observable {

    public _apiKey:string = '45829912';
    private _sessionId: string = '1_MX40NTgyOTkxMn5-MTQ5NTE0Mzk3NzI2OX5vdzhEdGtBSm40MW5KWU0rY3RFU3FJNUl-fg';
    private _publisherToken: string = 'T1==cGFydG5lcl9pZD00NTgyOTkxMiZzaWc9ZDMxMjcxMjE2MTcwZDRkMDY3ZDMyYzg4YmJkODZlYWQ0M2Q0MmQyMTpzZXNzaW9uX2lkPTFfTVg0ME5UZ3lPVGt4TW41LU1UUTVOVEUwTXprM056STJPWDV2ZHpoRWRHdEJTbTQwTVc1S1dVMHJZM1JGVTNGSk5VbC1mZyZjcmVhdGVfdGltZT0xNDk1MTQ0MDAzJm5vbmNlPTAuMjk1ODExOTA1MTIwMDI0MyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDk3NzM2MDAy';
    private _subscriberToken: string = 'T1==cGFydG5lcl9pZD00NTgyOTkxMiZzaWc9YTVhNzI5MWZkZWUzZjhhMGRhOWZlMGY2YjYyNzlkYjQ0MWYxOTYwODpzZXNzaW9uX2lkPTFfTVg0ME5UZ3lPVGt4TW41LU1UUTVOVEUwTXprM056STJPWDV2ZHpoRWRHdEJTbTQwTVc1S1dVMHJZM1JGVTNGSk5VbC1mZyZjcmVhdGVfdGltZT0xNDk1MTQ0MDI0Jm5vbmNlPTAuNjk3NTY4MTUzNjA3MTM0MSZyb2xlPXN1YnNjcmliZXImZXhwaXJlX3RpbWU9MTQ5NzczNjAyMw==';
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
            alert("signal received");
            console.dir(data);
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