// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");
require("component-responsive-frame/child");

var swipeContainer = document.querySelector(".swipe-container");

var Tender = require("./tender");
var questions = require("./questions");

var t = new Tender(swipeContainer, questions);


// var bc = require("./brightcove");

var dynamicPlaylist = 4720293201001;

// bc(function(player) {
//   player.catalog.getPlaylist(dynamicPlaylist, function(err, playlist) {

//     var index = 0;

//     player.catalog.load(playlist[index]);

//     player.on("ended", function() {
//       console.log(++index);
//       player.catalog.load(playlist[index]);
//       player.play();
//     });

//   });
// });


