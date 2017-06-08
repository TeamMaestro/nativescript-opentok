require("globals");
const platform = require("platform");
const fs = require("file-system");
const utils = require("utils/utils");
const downloadPDF = (msg) => {
    const path = msg.data.path;
    const link = msg.data.link;
    if (platform.isAndroid) {
        var output;
        var input;
        var interval;
        var progress = 0;
        var previous = 0;
        try {
            var count = 0;
            const uri = new java.net.URI(link);
            const url = uri.toURL();
            const connection = url.openConnection();
            fs.File.fromPath(path);
            var file = new java.io.File(path);
            var fileSize = connection.getContentLength();
            var data = Array.create("byte", 4096);
            var total = 0;
            var responseCode = connection.getResponseCode();
            var times = 0;
            if (responseCode === 200) {
                input = new java.io.BufferedInputStream(url.openStream());
                output = new java.io.FileOutputStream(file);

                global.postMessage({
                    status: 1
                });
                postMessage({ progress: progress });
                while ((count = input.read(data)) != -1) {
                    total += count;
                    progress = Math.floor((total * 100) / fileSize);;
                    if (progress > previous) {
                        postMessage({ progress: progress });
                        previous = progress;
                    }
                    output.write(data, 0, count);
                }
                if ((count = input.read(data)) === -1) {
                    global.postMessage({
                        status: 2
                    });
                    output.flush();
                    output.close();
                    input.close();
                }
            }
            else {
                postMessage({ type: "error", code: responseCode });
            }
        } catch (e) {
            console.log(e);
            postMessage({ type: "error", code: responseCode });
        }

    } else if (platform.isIOS) {

        const getter = utils.ios.getter;
        const NSURLSessionDownloadDelegateImpl = require("./ios/NSURLSessionDownloadDelegateImpl").NSURLSessionDownloadDelegateImpl;

        try {
            const queue = getter(NSOperationQueue, NSOperationQueue.mainQueue);
            const downloadRequest = NSMutableURLRequest.requestWithURL(NSURL.URLWithString(link));
            const delegate = NSURLSessionDownloadDelegateImpl.initWithPathProgressCompletion(path, function (progress) {
                global.postMessage(progress);
            }, function (completed, filePath) {
                if (completed) {
                    global.postMessage({
                        status: 2,
                        filePath: filePath
                    });
                }
            });

            const sessionConfig = getter(NSURLSessionConfiguration, NSURLSessionConfiguration.defaultSessionConfiguration);
            const application = getter(UIApplication, UIApplication.sharedApplication);
            const urlSession = NSURLSession.sessionWithConfigurationDelegateDelegateQueue(sessionConfig, delegate, queue);
            const downloadTask = urlSession.downloadTaskWithRequest(downloadRequest);
            downloadTask.resume();
            global.postMessage({
                status: 1
            });

        } catch (ex) {

            console.log(ex)
        }

    }
}
onmessage = (msg) => {
    downloadPDF(msg)
}