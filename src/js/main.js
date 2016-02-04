require("./lib/social");
require("./lib/ads");
var track = require("./lib/tracking");
require("component-responsive-frame/child");

var swipeContainer = document.querySelector(".swipe-container");

var Tender = require("./tender");
var questions = require("./questions");

var bc = require("./brightcove");

var dynamicPlaylist = "4720293201001";
var outtakesPlaylist = "4732490059001";

//test for desktop behavior
try {
  document.createElement("TouchEvent");
  document.body.classList.add("desktop");
} catch (err) {
  //lame touch test does nothing!
}

var closest = require("./closest");
var $ = s => Array.prototype.slice.call(document.querySelectorAll(s));

var dot = require("./lib/dot");
var playlistTemplate = dot.compile(require("./_playlistItem.html"));

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

    var listContainer = document.querySelector(".dating.playlist-container");
    listContainer.innerHTML = playlistTemplate(playlist);

  });

  var outtakeContainer = document.querySelector(".outtakes.playlist-container");

  if (outtakeContainer) {
    player.catalog.getPlaylist(outtakesPlaylist, function(err, playlist) {

      if (err) return console.log(err);

      outtakeContainer.innerHTML = playlistTemplate(playlist);

    });
  }

  document.body.addEventListener("click", function(e) {
    var target = closest(e.target, "playlist-link");
    if (!target) return;
    var id = target.getAttribute("data-id");
    if (!id) return;
    window.location = "#video-jump";
    document.body.classList.add("play-video");
    player.catalog.getVideo(id, function(err, media) {
      player.catalog.load(media);
      player.play();
    });
  })

});

var profiles = $(".profiles .person");
var names = $(".profiles [data-name]");

var selectProfile = function() {
  var id = this.getAttribute("data-name");
  var self = this;
  names.forEach(function(name) {
    if (name == self) {
      name.classList.add("selected");
    } else {
      name.classList.remove("selected");
    }
  });
  profiles.forEach(function(person) {
    if (person.id == id) {
      person.classList.remove("hidden");
    } else {
      person.classList.add("hidden");
    }
  });
};

names.forEach(el => el.addEventListener("click", selectProfile));

selectProfile.call(document.querySelector(".profiles [data-name]"));