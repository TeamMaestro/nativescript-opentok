import * as observable from 'data/observable';
import * as pages from 'ui/page';
import {HelloWorldModel} from './main-view-model';

import {OpenTok} from 'nativescript-opentok';


// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {


    // Get the event sender
    var page = <pages.Page>args.object;
    // page.bindingContext = new HelloWorldModel();

    var sessionID = '2_MX40NTA0NDI1Mn5-MTQ2NzE0MjAxOTMxMn5wUytVOE1Ndyt5VWRDd1FvSno5NGl2NFF-fg';
    var token = 'T1==cGFydG5lcl9pZD00NTA0NDI1MiZzaWc9NDc0OWZkNmQ1YzllOGU4OWVjZmIyMTIxZTg4MjIxODZlOGM2ZGQ3YjpzZXNzaW9uX2lkPTJfTVg0ME5UQTBOREkxTW41LU1UUTJOekUwTWpBeE9UTXhNbjV3VXl0Vk9FMU5keXQ1VldSRGQxRnZTbm81TkdsMk5GRi1mZyZjcmVhdGVfdGltZT0xNDY3MTQyMDMxJm5vbmNlPTAuNTAzMzk0NzAwODE5NjI2NSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDY5NzM0MDMw';

    var openTok = new OpenTok();

    openTok.init('45044252', sessionID, page.ios);
    openTok.doConnect(token);
    openTok.doPublish(page.ios);
}