import colors from "colors/safe.js";
import fs from "fs";
import "../polyfills/String.js";

/**
 * @app Logs Controller
 * 
 * @description Makes your console.log with colors && save logs / errors
 * 
 * @author Aloxx ^^
 * 
 * Required Modules For work:
 * @requires [colors,fs]
 * @requires [String#ReplaceAll]
 * 
 * avaibleSettings:
 *  save - boolean => save your file with logs or not
 *  path - string => path to file with logs
 *  debugMode - boolean => should we use logg as debug app
 *  updateTimeout - integer => how much delay between updates
 */
export class LogsController {
    constructor(settings = {}) {

        /**
         * To not call read/write billion times we store logs in array 
         */
        this.logsPending = []

        /**
         * Should save to file
         */
        this.saveToFile = settings.save ?? false;

        /**
         * Path to logs
         */
        this.logsPath = settings.path ?? "./logs/";

        /**
         * Debug mode toogleable
         */
        this.debugMode = settings.debugMode ?? false;

        /**
         * Timeout between clear/save data
         */
        this.updateTimeout = settings.updateTimeout ?? 15000; // ms

        /**
         * Interval to save cached-data
         */
        this.workerInterval = setInterval(() => { this.updateLogs(); }, this.updateTimeout)

    }
    LogINFO(message, color = false, isImportant = false) {

        /**
         * If there no color we send raw console log
         */
        if(!color) console.log(message);
        else {
            /**
             * If there color scheme we define it from @colors
             */
            const colorScheme = colors[color];

            /**
             * If scheme no found throwing error
             */
            if(!colorScheme) {
                throw SyntaxError(`[ELogs/Errors] Color "${color}" not found!`);
            }
            /**
             * Console data
             */
            console.log(colorScheme(message));
        }

        /**
         * If save enabled , we save file
         */
        if(this.saveToFile) {
            this.saveLogWith(message, isImportant);
        }

        /**
         * Returning our instance to re-call self if required
         */
        return this;
    }

    getStrokes(arrayWithStrokes) {
        /**
         * From array to string with new lines
         */
        for(var string = "",  i = 0; i < arrayWithStrokes.length; i++) 
            string += arrayWithStrokes[i] + "\n";
        
        return string;
    }

    getTimestamp() {
        /**
         * Date with hh:mm:ss format ^^
         */
        const timeElapsed = Date.now(), 
              today = new Date(timeElapsed);
        
        const hrs = today.getHours(),
              mins = today.getMinutes(),
              secs = today.getSeconds();
    
        /**
         * Adding 0 cuz looks better xd
         */
        return (hrs > 9 ? hrs : "0" + hrs) + ":" + (mins > 9 ? mins : "0" + mins) + ":" + (secs > 9 ? secs : "0" + secs);
    }

    saveLogWith(msg , isImportant) {
        /**
         * Adding date to see when message comes
         */
        msg = `[${this.getTimestamp()}] ` + msg;
        /**
         * Saves all pending data :\
         */
        if(isImportant) {
            this.logsPending.push(msg);
            
            this.save(this.getStrokes(this.logsPending));
            
            /**
             * Returning our instance to re-call self if required
             */
            return this;
        }

        /**
         * Put to pending if no important
         */
        this.logsPending.push(msg);

        /**
         * Returning our instance to re-call self if required
         */
        return this;
    }
    updateLogs() {
        /**
         * If logs is not empty we saving it
         */
        if(this.logsPending.length > 0) {
            if(this.debugMode) console.log(`[ELogs/DEBUG] Epoll/IntervalWorker, saving existing data, length of strings: ${this.logsPending.length}`);

            /**
             * Using save with getStrokes to get strings from array
             */
            this.save(this.getStrokes(this.logsPending));

            /**
             * Clearning for no duplicate data
             */
            this.clearLogs();
        }else {
            /**
             * Console only if there debug mode
             */
            if(this.debugMode) console.log(`[ELogs/DEBUG] Epoll/IntervalWorker, no data to save now!`);
        }
    }

    getCurrentFileName() {
        /**
         * File Name formatted as dd.mm.yy
         */
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        
        
        const date_parse = today.toLocaleDateString().replaceAll("/", ".");

        return date_parse;
    }
    save(string) {
        /**
         * Saving file data
         */
        const filePath = this.logsPath + this.getCurrentFileName() + '.log';

        if(!fs.existsSync(filePath)) {
           if(this.debugMode) console.log(`[ELogs/DEBUG] Saving non-existing data with file: ${filePath}`);

           return this.saveWithFile(string , filePath);
        }

        fs.readFile(filePath, 'utf-8', (err , data) => {
            if(err) {
                if(this.debugMode) console.log(`[ELogs/DEBUG] Error while processing data: `, err);

                return console.error(err);
            }
            this.saveWithFile(data + string , filePath);
        })

    }

    saveWithFile (data , filePath) {
         /**
          * Saving file data
          */
        fs.writeFileSync(filePath, data, { encoding: "utf-8"});

        if(this.debugMode) console.log(`[ELogs/DEBUG] Saved pending data , filePath: ${filePath}`);
    }
    clearLogs() {
         /**
          * Saving file data
          */
        this.logsPending = [];

        if(this.debugMode) console.log(`[ELogs/DEBUG] EPoll/ClearWorker cleared log data..`);
    }
}
