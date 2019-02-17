var mask = {
    money: function() {
        var el = this
        ,exec = function(v) {
        v = v.replace(/\D/g,"");
        v = new String(Number(v));
        var len = v.length;
        if (1== len)
        v = v.replace(/(\d)/,"0.0$1");
        else if (2 == len)
        v = v.replace(/(\d)/,"0.$1");
        else if (len > 2) {
        v = v.replace(/(\d{2})$/,'.$1');
        }
        return v;
        };
   
        setTimeout(function(){
        el.value = exec(el.value);
        convertCurrency();
        },1);
    }
}

function activeCurrency(currency,symbol,index) {

    var currencyText = currency.toUpperCase();
    $('.currency-symbol-'+index).text(currencyText);

    if (currency == 'btc') {
        $('#basic-addon'+index).html("<img src='public/assets/images/btc.png' class='currency-image-"+index+"' />");
    } else if (currency == 'eth') {
        $('#basic-addon'+index).html("<img src='public/assets/images/eth.png' class='currency-image-"+index+"' />");
    } else {
        $('#basic-addon'+index).text(symbol);
    }
    
    $(".currency-image-"+index).attr("src","public/assets/images/"+currency+".png");
    convertCurrency();
}

function convertCurrency() {
    var from = $('.currency-symbol-1').text();
    var to = $('.currency-symbol-2').text();;
    var amount = $('.fromCurrency').val();
    $('.toCurrency').val('');

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'api/?from='+from+'&to='+to+'&amount='+amount,
        async: true,
        success: function(response) {
            $('.toCurrency').val(response.to_value);
        }
    });
}

$( document ).ready(function() {
    convertCurrency();
    $('input').bind('keypress',mask.money);
    $('input').bind('keyup',mask.money);
});