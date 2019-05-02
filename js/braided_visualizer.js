class BraidedVisualizer extends Visualizer {
  constructor(braid, element) {
    super(braid, element);
    this.loom = new Loom(this.braid);
  }

  get rows() {
    return this.braid.parameters.num_beads * 2;
  }

  get columns() {
    return this.braid.parameters.num_threads / 2;
  }

  get width() {
    return ((this.columns + 0.5) * this.px_per_bead) + 'px';
  }

  wrap_beads(beads, beads_to_wrap) {
    for (var i = 0; i < beads_to_wrap; i++) {
      beads.push(beads.shift());
    }
    return beads;
  }

  render() {
    this.loom.weave();
    super.render();
  }

  svgs() {
    var elements = [];

    var row_height = 100 / this.rows;
    var row_mid = row_height / 2;
    var beads_to_wrap = 0;
    var initial_vertical_position = this.braid.two_d_parameters.initial_vertical_position;

    for (var i = 0; i < this.loom.beads.length; i++) {
      var y = initial_vertical_position + row_height * i + row_mid;
      var row = this.wrap_beads(this.loom.beads[i], beads_to_wrap);
      var row_svgs = this.row_svg(row, y, i % 2 === 0);

      row_svgs.forEach(function(svg) {
        elements.push(svg);
      });

      if (i % 2 === 1) {
        beads_to_wrap = (beads_to_wrap + 1) % this.beads_per_row;
      }
    }

    return elements;
  }

  row_svg(row, y, use_offset) {
    var elements = [];

    var column_width = this.px_per_bead;
    var column_mid = column_width / 2;
    var horizontal_step = this.braid.two_d_parameters.horizontal_step;
    var vertical_step = this.braid.two_d_parameters.vertical_step;

    for (var i = 0; i < row.length; i++) {
      var offset = (use_offset ? column_mid : 0);
      var x = column_width * i * horizontal_step + column_mid + offset;
      elements.push(this.bead_svg(row[i], x, (y + i * vertical_step) + '%'));
    }

    return elements;
  }
}
