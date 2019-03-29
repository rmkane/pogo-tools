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
})(jQuery);

function fromHyphenToCamelCase(str) {
  return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}
