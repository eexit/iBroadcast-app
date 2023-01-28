/* eslint-disable-next-line import/no-extraneous-dependencies */
const {
  BrowserWindow,
  Menu,
  Tray,
  shell,
  screen,
  app,
} = require('electron');
const { join } = require('path');

// Set a variable when the app is quitting.
let isQuiting = false;
let window;
let tray;

// Don't show the app in the doc yet
app.dock.hide();

app.on('ready', async () => {
  app.dock.show();

  tray = new Tray(join(__dirname, 'assets/trayTemplate.png'));
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Show App',
        click() {
          window.show();
        },
      },
      {
        label: 'GitHub',
        click() {
          shell.openExternal('https://github.com/eexit/iBroadcast-desktop');
        },
      },
      {
        label: 'Quit',
        click() {
          isQuiting = true;
          app.quit();
        },
      },
    ])
  );

  // Create a window that fills the screen's available work area.
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  window = new BrowserWindow({
    // Only because I don't want the app to be maximized but
    // still want it big enough to be comfortable using.
    width: width - width * 0.1,
    height: height - 50,
    center: true,
    show: false,
    darkTheme: true,
  });

  // Load ibroadcast web player
  window.loadURL('https://media.ibroadcast.com');

  // Display and focus the app once the URL has loaded
  window.once('ready-to-show', () => {
    window.show();
    window.focus();
  });

  // On close, minimize and don't quit
  window.on('close', (evt) => {
    if (!isQuiting) {
      evt.preventDefault();
      window.hide();
    }
  });

  window.on('minimize', (evt) => {
    evt.preventDefault();
    window.hide();
  });
});

app.on('before-quit', () => {
  isQuiting = true;
});

// Clicking on dock shows the application
app.on('activate', () => {
  window.show();
});
