class Visualizer {
  constructor(braid, element) {
    this.braid = braid;
    this.element = element;
    this.px_per_bead = 20;
  }

  render() {
    this.clean_element();

    var svgs = this.svgs();
    var element = this.element;
    element.setAttribute('style', 'height: ' + this.height());

    svgs.forEach(function(svg) {
      element.appendChild(svg);
    });
  }

  clean_element() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }

  height() {
    return (this.braid.numBeads * this.px_per_bead) + 'px';
  }

  svgs() {
    return [];
  }
}
