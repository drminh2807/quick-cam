// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, screen, ipcMain, systemPreferences } = require('electron')
const path = require('path')
const isMac = process.platform === 'darwin'
const createWindow = async () => {
    if (isMac) {
        const status = systemPreferences.getMediaAccessStatus('camera')
        if (status !== 'granted') {
            await systemPreferences.askForMediaAccess('camera')
        }
    }
    const displays = screen.getAllDisplays()
    const primaryDisplay = screen.getPrimaryDisplay()
    const secondDisplay = displays.find(d => d.id !== primaryDisplay.id)
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    if (secondDisplay) {
        mainWindow.setBounds(secondDisplay.bounds)
    }
    if (!isMac) {
        mainWindow.setFullScreen(true)
    }
    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle('setCameraSources', (event, sources) => {
    const cameraMenu = {
        label: 'Sources',
        submenu: sources.map((i, index) => ({
            label: i.text,
            type: 'radio',
            checked: index === 0,
            click: () => {
                event.sender.send('setCameraId', i.value)
            }
        }))
    }
    const { Menu } = require('electron')

    const template = [
        { role: 'appMenu' },
        cameraMenu,
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
})