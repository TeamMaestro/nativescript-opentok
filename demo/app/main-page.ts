import * as observable from 'data/observable';
import * as pages from 'ui/page';

import app = require("application");
import view = require("ui/core/view");

import {OpenTokDemo} from './main-view-model';

// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {

    // Get the event sender
    var page = <pages.Page>args.object;
    page.bindingContext = new OpenTokDemo();

}