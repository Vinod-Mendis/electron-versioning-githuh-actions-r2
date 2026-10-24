import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { autoUpdater } from 'electron-updater'

function setupUpdater(win) {
  const send = (text) => {
    if (!win.isDestroyed()) {
      win.webContents.send('status', text)
    }
  }

  autoUpdater.on('checking-for-update', () => send('Checking for update...'))
  autoUpdater.on('update-available', (info) => send(`Update found: ${info.version}`))
  autoUpdater.on('update-not-available', () => send('Already on the latest version'))
  autoUpdater.on('download-progress', (progress) => {
    send(`Downloading ${Math.round(progress.percent)}%`)
  })
  autoUpdater.on('error', (error) => send(`Updater error: ${error.message}`))
  autoUpdater.on('update-downloaded', () => {
    send('Update downloaded. Restart to install it.')
    win.webContents.send('update-ready')
  })

  ipcMain.handle('install-update', () => {
    autoUpdater.quitAndInstall()
  })
}

function createWindow() {
  const win = new BrowserWindow({
    width: 560,
    height: 420,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  setupUpdater(win)

  win.webContents.on('did-finish-load', () => {
    if (!app.isPackaged) {
      win.webContents.send('status', 'Dev mode. Updates run only in the installed app.')
      return
    }
    autoUpdater.checkForUpdates()
  })

  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  ipcMain.handle('version', () => app.getVersion())
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})
