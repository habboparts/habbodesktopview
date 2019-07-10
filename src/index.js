var getJSON = require('get-json');
const { app, BrowserWindow } = require('electron');
const nativeImage = require('electron').nativeImage;
const path = require('path');
const client = require('discord-rich-presence')('594207949837303814');
var timenow = Date.now();


setInterval(function() {
  getJSON('https://habbost.eu/api.php?key=088763baa76708edd7cd890791c17f4d&getroom=').then(function (response) {
    var newData = JSON.stringify(response);
    var getroomdata = JSON.parse(newData);
    if(getroomdata.user_online === '1') {
      client.updatePresence({
        details: "Spielt als: " + getroomdata.user_username,
        state: getroomdata.room_name + " (" + getroomdata.room_users + "/" + getroomdata.room_maxusers + ")",
        startTimestamp: timenow,
        largeImageKey: 'habbo-app-icon',
        largeImageText: "Habbo Hotel",
        instance: true,
      });
    } else {
      client.updatePresence({
        details: "Spielt gerade Habbo",
        startTimestamp: timenow,
        largeImageKey: 'habbo-app-icon',
        largeImageText: "Habbo Hotel",
        instance: true,
      });
    }


  }).catch(function (error) {
  });

}, 5000);


if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

var image = nativeImage.createFromPath(__dirname + '/icons/favicon.08c747be.png');
image.setTemplateImage(true);


if(process.platform  == 'win32'){
  ppapi_flash_path = 'pepflashplayer64_32_0_0_207.dll';
}  else if (process.platform == 'darwin') {
  ppapi_flash_path = 'pepflashplayer64_32_0_0_207.plugin';
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, ppapi_flash_path).replace('app.asar', 'app.asar.unpacked'));

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
	icon: image,
    webPreferences: {
      plugins: true
    }
  });
  
    mainWindow.setMenu(null);

  mainWindow.loadURL(`file://${__dirname}/index.html`, {"extraHeaders" : "pragma: no-cache\n"});

  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
    mainWindow.reloadIgnoringCache();
  }
});
