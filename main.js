const {app,BrowserWindow,ipcMain,screen}=require('electron');
const path=require('node:path');
let win;
function createWindow(){
 win=new BrowserWindow({width:320,height:500,minWidth:180,minHeight:270,transparent:true,frame:false,hasShadow:false,alwaysOnTop:true,resizable:true,show:true,title:'Muse Study Companion',webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,preload:path.join(__dirname,'preload.js')}});
 win.loadFile('index.html');
 win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 win.webContents.on('will-navigate',e=>e.preventDefault());
 win.on('closed',()=>{win=null});
}
app.whenReady().then(()=>{
 ipcMain.handle('muse:resize',(event,scale)=>{
  if(event.sender!==win?.webContents||!Number.isFinite(scale))return;
  const s=Math.max(40,Math.min(200,scale))/100;
  const bounds=screen.getDisplayMatching(win.getBounds()).workArea;
  win.setSize(Math.min(bounds.width,Math.max(180,Math.round(320*s))),Math.min(bounds.height,Math.max(270,Math.round(500*s))));
 });
 ipcMain.handle('muse:hide',event=>{if(event.sender===win?.webContents)win.minimize()});
 ipcMain.handle('muse:close',event=>{if(event.sender===win?.webContents)win.close()});
 createWindow();
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length)createWindow()});