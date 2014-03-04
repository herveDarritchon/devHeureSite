#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');

var indexPage, movie_webm, movie_mp4, movie_ogg;

fs.readFile(path.resolve(__dirname,process.env.OPENSHIFT_DATA_DIR + "/videos/DH_XXE_Kermit.mp4"), function (err, data) {
    console.log("Variable d'environnement OPENSHIFT_DATA_DIR = " + process.env.OPENSHIFT_DATA_DIR);
    if (err) {
        throw err;
    }
    movie_mp4 = data;
});

/**
 *  Define the sample application.
 */
 var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
     self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
     self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['historique.html'] = fs.readFileSync('./static/html/session.html');
        self.zcache['videoStreaming.html'] = fs.readFileSync('./videoStreaming.html');
        self.zcache['stdResponse.txt'] = fs.readFileSync('./static/stub/stdResponse.txt');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
     self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
     self.terminator = function(sig){
        if (typeof sig === "string") {
         console.log('%s: Received %s - terminating sample app ...',
             Date(Date.now()), sig);
         process.exit(1);
     }
     console.log('%s: Node server stopped.', Date(Date.now()) );
 };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
     self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
     self.createRoutes = function() {
        self.routes = { };

        self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/index'] = function(req, res) {
            res.setHeader('Content-Type', 'text/json');
            res.send(self.cache_get('stdResponse.txt') );
        };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('videoStreaming.html') );
        };

        self.routes['/home'] = function(req, res) {
            fs.readFile('./static/html/session.html', function(error, content) {
                if (error) {
                    console.log ("Error 500 - serving static html file --> session.html");
                    res.writeHead(500);
                    res.end();
                }
                else {
                    console.log ("serve static html file session.html");
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                }
            });
        };

        self.routes['/DH_XXE_final.mp4'] = function(req, res) {

            var total;
            total = movie_mp4.length;
            
            console.log ("Taille de la video a streamer : %s",total);
            var range = req.headers.range;

            var positions = range.replace(/bytes=/, "").split("-");
            var start = parseInt(positions[0], 20);
            // if last byte position is not present then it is the last byte of the video file.
            var end = positions[1] ? parseInt(positions[1], 20) : total - 1;
            var chunksize = (end-start)+1;

            res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
               "Accept-Ranges": "bytes",
               "Content-Length": chunksize,
               "Content-Type":"video/mp4"});
            res.end(movie_mp4.slice(start, end+1), "binary");

        };        
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
     self.initializeServer = function() {
        self.createRoutes();
        //self.app = express.createServer();

        self.app = express();

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };


    /**
     *  Initializes the sample application.
     */
     self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
     self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
 var zapp = new SampleApp();
 zapp.initialize();
 zapp.start();

