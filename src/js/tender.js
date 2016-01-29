var Hammer = require("hammerjs/hammer.min");
var dot = require("./lib/dot");
var template = dot.compile(require("./_tender.html"));

class Tender {
  constructor(element, questions) {
    this.element = element;
    this.mc = new Hammer(this.element);
    this.questions = questions;
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
      self.element.style.transform = `translateX(${e.deltaX}px)`
    });

    this.mc.on("panend", function(e) {
      if (self.animating) return;
      var threshold = self.element.offsetWidth / 2.5;
      var travel = e.deltaX;
      if (Math.abs(travel) > threshold) {
        return self.advance(travel < 0 ? "right" : "left");
      }

      self.element.classList.add("transition");
      self.element.style.transform = `translateX(0px)`;
    });
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
    console.log(item);

    //check the position in the list
    if (!this.questions[this.index]) {
      //all done!
      return this.conclude();
    }

    this.animating = true;
    this.element.classList.add("transition");
    this.element.classList.add("whiteout");
    setTimeout(() => {
      this.element.classList.remove("transition");
      this.element.style.transform = "";
      var _ = this.element.offsetWidth; //reflow
      this.element.classList.add("transition");
      this.render();
      this.element.classList.remove("whiteout");
      this.animating = false;
    }, 300)
  }

  conclude() {
    console.log("Finished");
  }
}

module.exports = Tender;