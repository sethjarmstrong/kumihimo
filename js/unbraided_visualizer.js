class UnbraidedVisualizer extends Visualizer {
  get rows() {
    return this.braid.parameters.num_beads + 1;
  }

  get columns() {
    return this.braid.parameters.num_threads + 1;
  }

  elements() {
    this.braid.reset_beading();

    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);
    tbody.appendChild(this.header_row());

    for (var i = 1; i < this.rows; i++) {
      tbody.appendChild(this.row(i));
    }

    return [table];
  }

  table_rows() {
    var elements = [];

    while (elements.length <= this.rows) {
      var tr = document.createElement('tr');
      elements.appendChild(tr);
    }
  }

  header_row() {
    var tr = document.createElement('tr');

    for (var i = 0; i < this.columns; i++) {
      var td = document.createElement('td');
      if (i != 0) {
        td.appendChild(document.createTextNode(i));
      }
      tr.appendChild(td);
    }

    return tr;
  }

  row(number) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.appendChild(document.createTextNode(number));
    tr.appendChild(td);

    for (var i = 0; i < this.braid.threads.length; i++) {
      var thread = this.braid.threads[i];
      td = document.createElement('td');
      td.appendChild(this.bead_svg(thread.next_bead()));
      tr.appendChild(td);
    }

    return tr;
  }

  bead_svg(bead) {
    var size = this.px_per_bead + 'px';
    var svg_element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg_element.setAttribute('style', 'height: ' + size + '; ' + 'width: ' + size);
    svg_element.appendChild(super.bead_svg(bead, '50%', '50%'));
    return svg_element;
  }
}
