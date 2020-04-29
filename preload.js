const { ipcRenderer, remote } = require('electron')
const path = require('path')
const axios = require('axios')

let data;
let notification = { title : 'Crypt Alert', body : 'Message', icon : path.join(__dirname, 'assets/icons/btc.png')}

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () =>
{
  let low = document.getElementById("low");
  let high = document.getElementById("max");
  let last = document.getElementById("high");
  let lower_alert = document.getElementById("lower_alert");
  let higher_alert = document.getElementById("higher_alert");
  let range = document.getElementById("range");

  document.getElementById("close-btn").addEventListener("click", function (e) {
     var window = remote.getCurrentWindow();
     window.hide();
  }); 
	
  checkApi();
  //checking if is time to run
  setInterval(checkApi, 60 * 1000);
})

const checkApi = () => {

  console.log('checking api');

  axios.get('https://api.bitcointrade.com.br/v3/public/BRLBTC/ticker').then(response => {
    data = response.data.data; 
    //set values on UI
    low.innerHTML = 'R$ '+data.low.toLocaleString('br');
    last.innerHTML = 'R$ '+data.last.toLocaleString('br');
    high.innerHTML = 'R$ '+data.high.toLocaleString('br');
    //update range element
    range.min = data.low;
    range.max = data.high;
    range.value = data.last;

    checkCorners();
  })
}

const checkCorners = () => {

    let corner = document.getElementById("corner");

    //check if it is low and going higher
    let lower_mark = data.low+(data.low* (corner.value/100));
    let higher_mark = data.high-(data.high* (corner.value/100));

    lower_alert.innerHTML = 'R$ '+lower_mark.toLocaleString('br');
    higher_alert.innerHTML = 'R$ '+higher_mark.toLocaleString('br');

    // console.log('lower_mark: ' +lower_mark);
    // console.log('higher_mark: ' +higher_mark);
    if (data.last <= (lower_mark) ) {
      showNotification("Crypto is near to lower corner")
    }

    if (data.last >= (higher_mark) ) {
      showNotification('Crypto is near to higher corner');
    }
}

const showNotification = (message) => {
  notification.body = message;
  const myNotification = new window.Notification(notification.title, notification);
}