class Visualizer {
  constructor(braid, element, control_elements) {
    this.braid = braid;
    this.element = element;
    this.control_elements = control_elements;
    this.bead_svgs = [];
  }

  render() {
    this.clean_element();

    var element = this.element;
    this.elements().forEach(function(e) {
      element.appendChild(e);
    });
  }

  destroy() {
    this.clean_element();
  }

  clean_element() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }

  elements() {
    return [];
  }
}
