// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");
require("component-responsive-frame/child");

var swipeContainer = document.querySelector(".swipe-container");

var Tender = require("./tender");
var questions = require("./questions");

var bc = require("./brightcove");

var dynamicPlaylist = 4720293201001;

//test for desktop behavior
try {
  document.createElement("TouchEvent");
  document.body.classList.add("desktop");
} catch (err) {
  //lame touch test does nothing!
}

bc(function(player) {
  window.bcPlayer = player;

  player.autoplay(true);

  player.catalog.getPlaylist(dynamicPlaylist, function(err, playlist) {
    if (err) console.log(err);

    questions.forEach(function(q, i) {
      q.left.video = playlist[i * 2];
      q.right.video = playlist[i * 2 + 1];
    });

    var t = new Tender(swipeContainer, questions, player);

  });
});


