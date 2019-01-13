class Visualizer {
  constructor(braid, element) {
    this.braid = braid;
    this.element = element;
    this.px_per_bead = 20;
    this.bead_radius = 8;
    this.bead_svgs = [];
  }

  render() {
    this.bead_svgs = [];
    this.clean_element();

    this.element.setAttribute('style', this.style());

    var element = this.element;
    this.elements().forEach(function(e) {
      element.appendChild(e);
    });
  }

  style() {
    return 'style', 'height: ' + this.height + '; ' + 'width: ' + this.width;
  }

  clean_element() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }

  get height() {
    return (this.rows * this.px_per_bead) + 'px';
  }

  get width() {
    return (this.columns * this.px_per_bead) + 'px';
  }

  get rows() {
    return 0;
  }

  get columns() {
    return 0;
  }

  elements() {
    var svg_element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg_element.setAttribute('style', 'height: ' + this.height + '; ' + 'width: ' + this.width);
    var svgs = this.svgs();

    svgs.forEach(function(svg) {
      svg_element.appendChild(svg);
    });

    return [svg_element];
  }

  svgs() {
    return [];
  }

  bead_svg(bead, x, y) {
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', this.bead_radius);
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('stroke-width', 1);
    circle.setAttribute('fill', bead.colour);
    this.bead_svgs.push({ bead: bead, element: circle });
    return circle;
  }
}