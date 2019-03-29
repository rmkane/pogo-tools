var PkmnData = [];

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
  title: 'Level',
  sortable : true
},  {
  field: 'atk',
  title: 'Attack',
  sortable : true
}, {
  field: 'def',
  title: 'Defense',
  sortable : true
}, {
  field: 'sta',
  title: 'Stamina',
  sortable : true
}];

$(() => {
  $('#results').bootstrapTable({
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
  
  $.ajax({
    url : 'data/gamemaster.json',
    type: 'GET',
    cache : true,
    success : function(data) {
      PkmnData = filterData(data, PkmnTempPattern, PkmnModel);
      $('#pokemon').populateDropdown(PkmnData, {
        textFn : (data => formatName(data)),
        valField : 'templateId'
      }).val('V0386_POKEMON_DEOXYS_DEFENSE');
    }
  });
  
  $('#main-form').on('submit', function(e) {
    e.preventDefault();
    let results = gatherRecords($(this).formParams());
    if (results.length === 0) toastr.warning("No results found.", "Warning");
    $('#results').bootstrapTable('load', results.map((result, row) => Object.assign(result, { id : row + 1 })));
  });  
});
