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

$(() => {
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
    if (results.length === 0) toastr.warning("No results found.", "Warning")
    $('#results').populateTable(results, [ 'id', 'lvl', 'atk', 'def', 'sta' ]);
  });  
});
