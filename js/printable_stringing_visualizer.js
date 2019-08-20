class PrintableStringingVisualizer extends StringingVisualizer {
  create_colour_descriptor(colour) {
    var colour_value = colour.bead.colour;
    var colour_name = ntc.name(colour_value).name;
    return colour.count + ' x ' + colour_name;
  }

  create_colour_descriptors(container, colours) {
    var colour_descriptor_strings = [];
    for (var i = 0; i < colours.length; i++) {
      colour_descriptor_strings.push(this.create_colour_descriptor(colours[i]));
    }
    container.appendChild(document.createTextNode(colour_descriptor_strings.join(', ')));
  }
}
