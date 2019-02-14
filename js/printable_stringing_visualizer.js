class PrintableStringingVisualizer extends StringingVisualizer {
  create_colour_descriptor(colour, last_colour) {
    var colour_value = colour.bead.colour;
    var colour_name = ntc.name(colour_value).name;

    var colour_descriptor_string = colour.count + ' x ' + colour_name + (last_colour ? '' : ',');

    var colour_descriptor = document.createElement('div');
    colour_descriptor.appendChild(document.createTextNode(colour_descriptor_string));
    colour_descriptor.setAttribute('class', 'left');
    colour_descriptor.setAttribute('style', 'margin-right: 5px');

    return colour_descriptor;
  }
}
