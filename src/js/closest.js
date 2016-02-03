var closest = function(element, classname) {
  while (element && !element.classList.contains(classname)) element = element.parentElement;
  return element;
};

module.exports = closest;