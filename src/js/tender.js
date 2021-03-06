var Hammer = require("hammerjs/hammer.min");
var dot = require("./lib/dot");
var template = dot.compile(require("./_tender.html"));

var flip = require("./flip");

var closest = require("./closest");

class Tender {
  constructor(element, questions, player) {
    this.element = element;
    this.mc = new Hammer(this.element);
    this.questions = questions;
    this.player = player;
    this.index = 0;
    this.winners = [];
    this.animating = false;

    this.registerEvents();
    this.render();
  }

  registerEvents() {
    var self = this;

    this.mc.on("panstart", function() {
      self.element.classList.remove("transition");
    });

    this.mc.on("pan", function(e) {
      self.element.classList.add("moving");
      var x = e.deltaX;
      var max = self.element.getBoundingClientRect().width / 2;
      if (x > max) x = max;
      if (x < -max) x = -max;
      self.element.style.transform = `translateX(${x}px)`
      self.element.classList.add(e.deltaX < 0 ? "right-leaning" : "left-leaning");
      self.element.classList.remove(e.deltaX < 0 ? "left-leaning" : "right-leaning");
    });

    this.mc.on("panend", function(e) {
      if (self.animating) return;

      self.element.classList.remove("moving");

      self.element.classList.remove("left-leaning");
      self.element.classList.remove("right-leaning");
      var threshold = self.element.offsetWidth / 2.5;
      var travel = e.deltaX;
      if (Math.abs(travel) > threshold) {
        return self.advance(travel < 0 ? "right" : "left");
      }

      self.element.classList.add("transition");
      self.element.style.transform = `translateX(0px)`;
    });

    this.mc.on("tap", function(e) {
      var side = closest(e.target, "side");
      self.advance(side.classList.contains("left") ? "left" : "right");
    })
  }

  render() {
    var q = this.questions[this.index];
    this.element.innerHTML = template(q);
    this.element.style.transform = "";
  }

  advance(winner) {
    var self = this;
    var item = this.questions[this.index][winner]
    this.winners.push(item);
    this.index++;

    //check the position in the list

    this.migrateThumbnail(winner);
    this.animating = true;
    this.element.classList.add("transition");
    this.element.classList.add("whiteout");
    setTimeout(() => {
      if (!this.questions[this.index]) {
        //all done!
        return this.conclude();
      }
      this.element.classList.remove("transition");
      this.element.style.transform = "";
      var _ = this.element.offsetWidth; //reflow
      this.element.classList.add("transition");
      this.render();
      this.element.classList.remove("whiteout");
      this.animating = false;
    }, 300)
  }

  migrateThumbnail(side) {
    var selected = this.element.querySelector(`.${side}.thumbnail`);
    if (!selected) return console.log(`No thumbnail for ${side}`);
    flip(selected, function() {
      selected.classList.remove(side);
      selected.classList.remove("pending");
      selected.parentElement.removeChild(selected);
      var playlist = document.querySelector(".playlist-selection");
      playlist.insertBefore(selected, playlist.lastElementChild);
    });
  }

  conclude() {
    var self = this;
    this.player.catalog.load(this.winners.map(w => w.video));
    this.player.play();
    document.body.classList.add("play-video");
  }
}

module.exports = Tender;