import {EventData} from 'data/observable';
import {Page} from 'ui/page';
import {isAndroid, isIOS} from 'platform';

import {Demo} from './main-view-model';
import {TNSOTPublisher, TNSOTSubscriber, TNSOTSession} from 'nativescript-opentok';

export function pageLoaded(args: EventData) {
    var page = <Page>args.object;
    page.bindingContext = new Demo(page);
}

// export function publisherLoaded(args: EventData) {
//     let publisher = <TNSOTPublisher> args.object;
//     if(isAndroid) {
//         console.log('OpenTok Publisher Native Android: ' + publisher.android);
//     }
//     else if(isIOS) {
//         console.log('OpenTok Publisher Native iOS: ' + publisher.ios);
//     }

//     page.bindingContext.message = 'Hello from the otherside';

//     // connectToSession(_publisherToken);
// }

export function subscriberLoaded(args: EventData) {
    let subscriber = <TNSOTSubscriber> args.object;
    if(isAndroid) {
        console.log('OpenTok SubScriber Native Android: ' + subscriber.android);
    }
    else if(isIOS) {
        console.log('Opentok Subscriber Native iOS: ' + subscriber.ios);
    }
}


exports.pageLoaded = pageLoaded;