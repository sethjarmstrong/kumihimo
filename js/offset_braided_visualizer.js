class OffsetBraidedVisualizer extends Visualizer {
  constructor(braid, element) {
    super(braid, element);
    this.loom = new Loom(this.braid);
  }

  // This is to add the extra height needed to render all the rows.
  get rows() {
    var num_beads = this.braid.parameters.num_beads;
    var num_threads = this.braid.parameters.num_threads;
    var beads_per_row = num_threads / 2;
    return Math.ceil(num_beads * num_threads / beads_per_row + ((beads_per_row / 2) - 1) * 0.5);
  }

  get columns() {
    return this.braid.parameters.num_threads / 2;
  }

  get width() {
    return ((this.columns + 0.5) * this.px_per_bead) + 'px';
  }

  // This is the percentage of vertical space that each row takes up.
  get row_height() {
    return 100 / this.rows;
  }

  // The mid point is the line along which beads will be placed.
  get row_mid() {
    return this.row_height / 2;
  }

  get beads() {
    return { positives: this.loom.beads[0], negatives: this.loom.beads[1] };
  }

  render() {
    this.loom.weave();
    super.render();
  }

  svgs() {
    var elements = [];
    var beads_to_wrap = 0;
    var this_ = this;
    var beads_per_row = this.braid.parameters.num_threads / 2;
    var initial_vertical_position = this.braid.two_d_parameters.initial_vertical_position;
    var vertical_step = this.braid.two_d_parameters.vertical_step;
    var horizontal_step = this.braid.two_d_parameters.horizontal_step;

    var draw_spiral = function(dataset, vertical_offset, horizontal_offset, initially_indented) {
      var indentation_mask = initially_indented ? 1 : 0;
      var results = [];
      for (var i = 0; i < dataset.length; i++) {
        var row = dataset.slice(i * beads_per_row / 2, (i + 1) * beads_per_row / 2);
        for (var j = 0; j < row.length; j++) {
          var y = vertical_offset + (this_.row_height * i + j * vertical_step * this_.row_height + this_.row_mid) + '%';
          var x = horizontal_offset * indentation_mask + this_.px_per_bead * j * horizontal_step + this_.px_per_bead / 2 + (i % 2 === 0 ? this_.px_per_bead / 2 : 0);
          results.push(this_.bead_svg(row[j], x, y));
        }
        indentation_mask = (indentation_mask + 1) % 2;
      }
      return results;
    };

    elements = elements.concat(draw_spiral(this.beads.positives, initial_vertical_position, horizontal_step * this.px_per_bead * beads_per_row / 2, false));
    elements = elements.concat(draw_spiral(this.beads.negatives, initial_vertical_position, horizontal_step * this.px_per_bead * beads_per_row / 2, true));

    return elements;
  }
}
