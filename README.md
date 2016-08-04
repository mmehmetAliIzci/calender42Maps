# Calender42Maps 

`npm install -g ionic@beta`
`npm install -g cordova`

Go into project
`npm install`

```console
cordova plugin add https://github.com/phonegap-googlemaps-plugin/cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="AIzaSyB91jonEfpJ9MKeSX8o6Wq2gShrnfF0bN0" --variable API_KEY_FOR_IOS="AIzaSyAq2010a7urbB1XvX1KL0yB68DojR2Tow4"
```

`cordova prepare`


###Manualy Install Correct Version of Module
You MUST install the plugin from the HEAD on the github repo, using the following command, the `cordova prepare` command will use the correct version which is saved in the `config.xml`


