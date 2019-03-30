var PkmnData = [];
var $table = null;

// https://codeseven.github.io/toastr/demo.html
toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-center",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

var columnConfig = [{
  field: 'id',
  title: '#',
  sortable : true
}, {
  field: 'lvl',
  title: 'LVL',
  sortable : true
},  {
  field: 'atk',
  title: 'ATK',
  sortable : true
}, {
  field: 'def',
  title: 'DEF',
  sortable : true
}, {
  field: 'sta',
  title: 'STA',
  sortable : true
}];

$(() => {
  $table = $('#results');
  
  // Initialize Bootstrap table
  $table.bootstrapTable({
    columns: columnConfig,
    pagination: true,
    search: true,
    sortable : true,
    sortStable: true,
    /** Options and filters */
    showSearch: true,
    showFilter: true,
    showColumns: true,
    showRefresh: true,
    showMultiSort: true,
    showExport: true,
    buttonsAlign: 'right',
  });
  $.fixBootstrapMultisort();
  
  // Add listeners
  $('#main-form').on('submit', onSubmit);
  $('#btn-reset').on('click', onReset);
  
  // Load data
  $.ajax({
    url : 'data/gamemaster.json',
    type: 'GET',
    cache : true,
    success : function(data) {
      PkmnData = filterData(data, PkmnTempPattern, PkmnModel);
      $('#field-pokemon').populateDropdown(PkmnData, {
        textFn : (data => formatName(data)),
        valField : 'templateId'
      });
      $('#btn-reset').trigger('click');
    }
  });
});

function onSubmit(e) {
  e.preventDefault();
  let results = gatherRecords($(this).formParams());
  if (results.length === 0) toastr.warning("No results found.", "Warning");
  $table.bootstrapTable('load', results.map((result, row) => Object.assign(result, { id : row + 1 })));
}

function onReset(e) {
  let $form = $(this).closest('form');
  $table.bootstrapTable('removeAll');
  $form.loadForm(FieldDefaults);
}
