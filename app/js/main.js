var get_url = function get_url(obj) {
    var url = decodeURIComponent(window.location.search.substring(1)),
    var_url = url.split('&'),
    parameters,
    i;
    for (i = 0; i < var_url.length; i++) {
        parameters = var_url[i].split('=');
        
        if (parameters[0] === obj) {
            return parameters[1] === undefined ? true : parameters[1];
        }
    }
};

$(document).ready(function () {
    $('#form_currency').on('keyup', 'input' , function (e) { 
        $(this).val($(this).val().replace(/[^0-9\.]/g,''));
        var select_parent = $(this).parents('.form_item').find('select'),
        select_value_from = $('#form_currency').find('.select_from').val(),
        select_value_to = $('#form_currency').find('.select_to').val(),
        select_from,
        select_to,
        count = $(this).val();
        
        $.ajax({url: "js/money.json", success: function(result){            
            select_from = result.quotes['USD' + select_value_from];
            select_to = result.quotes['USD' + select_value_to];
            if(select_parent.hasClass('select_from')) {
                $('.value_to').val((1/select_from)*select_to*count);
            }
            else {
                $('.value_from').val((1/select_to)*select_from*count);
            }
        }});
    });
    $('#form_currency').on('change', 'select' , function (e) {
        $('.value_from').trigger(
            jQuery.Event( 'keyup', { keyCode: 13, which: 13 } )
        );
    });
    $('#form_currency .toggle_form').click(function (e) { 
        e.preventDefault();
        var aux;
        aux = $('.select_from').val();
        $('.select_from').val($('.select_to').val());
        $('.select_to').val(aux);
        $('.value_from').trigger(
            jQuery.Event( 'keyup', { keyCode: 13, which: 13 } )
        );
        
    });
    if(get_url('from')) {
        $('.select_from').val(get_url('from'));
    }
    if(get_url('from')) {
        $('.select_to').val(get_url('to'));
    }
    if(get_url('amount')) {
        $('.value_from').val(get_url('amount'));
        $('.value_from').trigger(
            jQuery.Event( 'keyup', { keyCode: 13, which: 13 } )
        );
    }
    $('.form_submit').click(function (e) { 
        e.preventDefault();
        var url_origin = window.location.origin,
            from  =  $('.select_from').val(),
            to  =  $('.select_to').val(),
            amount  =  $('.value_from').val(),
            url_gerada = url_origin + '/?from=' + from + '&to='+to+ '&amount=' + amount;

        window.location = url_gerada;

    });
});