/**
 * npm i express http cors path <- installing these stuff ^^
 */
import express from "express";
import http from "http";
import cors from "cors";
import serveIndex from "serve-index"
import path from "path";

/**
 * HttpController - a http server that makes your logs stores in server 
 */
export class HttpController {
    constructor(logController , httpSettings) {
        /**
         * Getting Instances
         */
        this.logController = logController;
        this.httpSettings = httpSettings;

        /**
         * Using express && cors for safe server creation
         */
        this.app = express();
        this.app.use(cors()); // <- important for secured servers

        /**
         * Creating dir named logs inside server for display files aswell
         */
        this.app.use("/logs", express.static(path.join(process.cwd()) + "/logs")); // <- important for use files
        /**
         * Using http#createServer for manage & create our server
         */
        this.httpServer = http.createServer(this.app);

        /**
         * Listening it on chosen port
         */
        this.createPollListener(httpSettings.port ?? 80);

    }

    createPollListener(port) {
        this.httpServer.listen(port, () => {
            /**
             * Logging that server listening
             * @todo Add configuration to remove listenLogs
             */
            this.logController.LogINFO(`[HttpService/Tracker] Listening on ::${port}`, "yellow", false);

            /**
             * Using pather
             */
            this.createDefaultPath();
        })
    }

    createDefaultPath() {
        if(this.httpSettings.useDefaultPather) {
            /**
             * Logging patherLoader
             * @todo Add configuration to remove listenLogs
             */
            this.logController.LogINFO(`[HttpService/Tracker] Creating Default PathPoll`, "yellow", false);

            /**
             * Using /logs to browse files inside server
             */
            this.app.use('/logs', serveIndex(process.cwd() + '/logs'));
        }
    }
}
