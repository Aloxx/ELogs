# ELogs
Simple Logs built with ES6 , may help you to make console.log looking way better, saves your logs in files!


# Usage Example

To create and manage logs we need call LoggerController with new and do some settings..

![image](https://user-images.githubusercontent.com/105514122/226968200-25b36b1c-7b22-4f92-b99e-4ce97d7deba9.png)

To log any information we do LoggerController#LogInfo(msg , color , isImportant)

    msg: string => Logging message

    color: string => Color Message @Nullable

    isImportant: boolean => Is need hard save inside file @Nullable

![image](https://user-images.githubusercontent.com/105514122/226968627-a7742ae9-c877-47b2-9ad7-1e1fe6f22a5d.png)


Avaible settings for LoggerController settings:

avaibleSettings:
 *  save - boolean => save your file with logs or not
 *  path - string => path to file with logs
 *  debugMode - boolean => should we use logg as debug app
 *  updateTimeout - integer => how much delay between updates
 *  httpService: - object => creates http service for you 

        * port: 80, - number => port of http service
        * useDefaultPather: true - boolean => using serveIndex for fileBrowser inside http service

# 22.03.2023 - HttpService

Now you can read all your logs from http server, there also fileBrowser

![image](https://user-images.githubusercontent.com/105514122/226969335-724579c5-54cc-4413-9bc7-2b988c7760e0.png)

![image](https://user-images.githubusercontent.com/105514122/226969388-b823b133-3f1c-4550-9fcd-5a0f6617e106.png)

For run HttpService you need put httpService: {} inside your settings code

