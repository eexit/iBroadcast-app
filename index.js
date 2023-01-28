/* eslint-disable-next-line import/no-extraneous-dependencies */
const {
  BrowserWindow,
  Menu,
  Tray,
  nativeImage,
  shell,
  screen,
  app,
} = require('electron');
const sharp = require('sharp');

// Set a variable when the app is quitting.
let isQuiting = false;
let window;
let tray;

// Don't show the app in the doc yet
app.dock.hide();

app.on('ready', async () => {
  app.dock.show();

  tray = new Tray(
    nativeImage.createFromBuffer(
      await sharp(
        Buffer.from(
          '<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><path d="M9.516 228.57h94.193v234.585H9.516V228.57zm100.891-95.275c0 29.66-24.056 53.709-53.715 53.709-29.66 0-53.709-24.05-53.709-53.709 0-29.66 24.05-53.715 53.709-53.715 29.66 0 53.715 24.056 53.715 53.715zm330.269 107.341c33.55-19.014 48.099-51.482 48.099-83.298 0-35.36-12.816-62.634-36.858-80.56-23.557-18.432-57.599-27.933-100.143-27.933H199.732V462.49h135.92c69.907 0 97.257-3.883 135.266-35.776 25.2-20.741 38.099-57.01 38.099-90.067-.083-17.267-1.74-72.55-68.34-96.01zm-135.26-99.075h37.426c8.433 0 19.5 0 28.425 3.96 9.008 3.883 16.276 11.817 16.276 27.433 0 16.116-7.268 24.542-16.768 29.084-9.424 3.884-20.658 3.884-27.933 3.884h-37.426v-64.36zm81.059 223.011c-11.158 5.132-24.625 5.132-31.317 5.132h-49.742v-75.442h49.742c8.426 0 21.817 0 32.475 4.459 11.151 4.459 20.076 13.384 20.076 31.317 0 19.5-9.508 29.666-21.234 34.534zm0 0" stroke="null"/></svg>'
        )
      )
        .png()
        .resize(16, 16)
        .toBuffer()
    )
  );
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
