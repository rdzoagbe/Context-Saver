import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

async function getActiveWindowTitle() {
  try {
    if (process.platform === 'win32') {
      const command = 'powershell -command "(Get-Process | Where-Object { $_.MainWindowHandle -eq (Add-Type \u0027[DllImport(\"user32.dll\")] public static extern IntPtr GetForegroundWindow();\u0027 -Name \"Win32GetForegroundWindow\" -PassThru)::GetForegroundWindow() }).MainWindowTitle"';
      const { stdout } = await execAsync(command);
      return stdout.trim();
    } else if (process.platform === 'darwin') {
      const command = 'osascript -e "tell application \"System Events\" to get name of first process whose frontmost is true"';
      const { stdout } = await execAsync(command);
      return stdout.trim();
    }
  } catch (error) {
    return 'Unknown Application';
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    show: false,
  });

  // Always use localhost:3000 to ensure Firebase Auth (Popups) work correctly
  // Your server.ts handles the static file serving for you
  mainWindow.loadURL('http://localhost:3000');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-active-window', async () => {
  return await getActiveWindowTitle();
});
