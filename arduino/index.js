/* 
Original code was written by Zac Delventhal @delventhalz.
Adapted by Nero Vanbiervliet
 */


'use strict'

const {
  makeKeyPair,
  getState,
  submitUpdate
} = require('./api_interaction')

// application object
const app = { user: null, currentAsset: null, assets: null}

// creates a new fish asset
// first checks the state for the next free name: fish1, fish2, fish3...
app.createAsset = function () {
  let id = 0
  let existingNames = app.assets.map(x => x.name)
  let newName
  while (true) {
    id++
    newName = 'fish'+id
    if (!existingNames.includes(newName)) break;
  }

  let catchTime = Date.now()
  let catchLat = Math.random() * (55.0 - 1.0) + 1.0
  let catchLon = Math.random() * (55.0 - 1.0) + 1.0

  console.log(newName + ' submitted to validator' + 'catched at: ' + catchLat + ' ' + catchLon + ' At: ' + catchTime)
  this.currentAsset = newName
  // submit new asset to api
  submitUpdate({action:'create', asset:newName, time: catchTime, lat: catchLat, lon: catchLon, owner:this.user.public}, this.user.private)
}

// set the state of the current asset to tilted
app.setTilted = function () {
  submitUpdate({action: 'add-tilted', asset:app.currentAsset, owner:app.user.public}, app.user.private)
}
// set the state of the current asset to tilted
app.addTemperature = function () {
  submitUpdate({action: 'add-temperature', asset:app.currentAsset, owner:app.user.public}, app.user.private)
}



// initialise
app.user = makeKeyPair()
getState(app.assets).then(function (assets) {
  app.assets = assets
  // new asset is created upon running the script
  app.createAsset()
  setTimeout(app.setTilted, 10e3); // set tilted after ten seconds
})
