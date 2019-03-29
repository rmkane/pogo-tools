(function($) {
  $.fn.formParams = function() {
    return $(this).serializeArray().reduce((query, param) => Object.assign(query, { [fromHyphenToCamelCase(param.name)] : param.value }), {});
  };
  $.fn.populateDropdown = function(data, options) {
    options = options || {};
    let textField = options.textField || 'textField';
    let valField = options.valField || 'valField';
    return this.empty().append(data.map(item => {
      let text, val;
      if (!$.isPlainObject(item)) {
        text = item;
        val = item;
      } else {
        text = options.textFn ? options.textFn.call(null, item) : item[textField];
        val = options.valFn ? options.valFn.call(null, item) : item[valField];
      }
      return $('<option>').text(text).val(val);
    }));
  };
  $.fn.populateTable = function(data, fields) {
    this.find('tbody').empty().append(data.map((item, row) => {
      return $('<tr>').attr('scope', 'row').append(fields.map((field, index) => {
        return $('<td>').text(index === 0 ? (row + 1) : item[field]);
      }));
    }));
    return this;
  };
  $.fixBootstrapMultisort = function() {
    let $button = $('.multi-sort'),
      $modal = $('div[id^="sortModal_"].modal'),
      $toolbar = $modal.find('.modal-dialog #toolbar');
    // Wrap the button in a button group element.
    $button.addClass('btn-secondary').wrap($('<div>').addClass('btn-group'));
    // Fix modal title alignment.
    $modal.find('.modal-dialog .modal-content .modal-header .modal-title').css({ position: 'absolute', lineHeight: 1 });
    // Fix the icons.
    $button.find('.fa.glyphicon-sort').removeClass('glyphicon-sort').addClass('fa-sort').css('width', '1em');
    $toolbar.find('i.glyphicon-plus').removeClass('glyphicon-plus').addClass('fa-plus');
    $toolbar.find('i.glyphicon-minus').removeClass('glyphicon-minus').addClass('fa-minus');
  };
})(jQuery);

function fromHyphenToCamelCase(str) {
  return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}
