import * as observable from 'data/observable';
import * as pages from 'ui/page';

import app = require("application");
import view = require("ui/core/view");

import {OpenTokDemo} from './main-view-model';
var page;
// Event handler for Page "loaded" event attached in main-page.xml

export function pageLoaded(args: observable.EventData) {

    // Get the event sender
     page = <pages.Page>args.object;
    page.bindingContext = new OpenTokDemo();
    var ot: any = page.getViewById('otPub');
    var otSub: any = page.getViewById('otSub');
    var sl: any = page.getViewById('sl');
    page.bindingContext._session.sessionEvents.on('sessionDidConnect', (result) => {
        //   ot.publisher;
       page.bindingContext._session.publish(ot.publisher);

        ot.on('didFailWithError', (data) => {
            console.log('error');
            console.dump(data.object.error.errorMessage())
        });
        ot.on('streamCreated', (data) => {
            console.log('created')
        });
        ot.on('streamDestroyed', (data) => {
            console.log('destroyed')
        });
        ot.on('cameraError', (data) => {
            console.log('cameraError');
            console.log(data.object.error.getMessage())
        });
        ot.on('cameraChanged', (data) => {
            console.log('cameraChanged');
            console.dump(data)
        });
        ot.on('streamDestroyed', (data) => {
            console.log('destroyed')
        });

        page.bindingContext._session.sessionEvents.on('streamCreated', (data) => {
            console.log('streamCreated event on session object');
          otSub.subscribe(app.android.currentContext,data.stream);
            let sub = otSub.subscriber;
           page.bindingContext._session.subscribe(sub);
        });
        page.bindingContext._session.sessionEvents.on('streamDestroyed', () => {
            console.log('streamCreated event on session object');
        });

    });

}


export function cycleCamera(){
    var ot: any = page.getViewById('otVideo');
    ot.cycleCamera();
}


export function togglePublisherVideo() {
    var ot: any = page.getViewById('otPub');
    ot.toggleVideo();
}

export function togglePublisherAudio() {
    var ot: any = page.getViewById('otPub');
    ot.toggleAudio();
}

export function cyclePublisherCamera() {
    var ot: any = page.getViewById('otPub');
    ot.cycleCamera();
}

export function toggleSubscriberVideo() {
    var otSub: any = page.getViewById('otSub');
    otSub.toggleVideo();
}

export function toggleSubscriberAudio() {
    var otSub: any = page.getViewById('otSub');
    otSub.toggleAudio();
}

export function cycleSubscriberCamera() {
    var otSub: any = page.getViewById('otSub');
    otSub.cycleCamera();
}