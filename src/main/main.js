import path from 'path'
import { app, BrowserWindow } from 'electron'

const MAIN_WINDOW_CONTENT_URL = path.resolve(__dirname, '..', 'renderer', 'index.html')

let mainWindow // eslint-disable-line no-unused-vars
function createWindow () {
  mainWindow = new BrowserWindow({
    title: 'Lumos Control',
    width: 800,
    height: 600,
    show: true
  })
  mainWindow.loadURL(`file://${MAIN_WINDOW_CONTENT_URL}`)
}

app.on('window-all-closed', () => {
  app.quit()
})

app.on('ready', () => {
  createWindow()
})
