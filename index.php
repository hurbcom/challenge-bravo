<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Conversor de Moedas</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="public/assets/plugins/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet/less" type="text/css" href="public/assets/css/styles.less" />
    <script src="public/assets/js/jquery-3.0.0.min.js"></script>
    <script src="public/assets/js/popper.min.js"></script>
    <script src="public/assets/plugins/bootstrap/js/bootstrap.min.js"></script>
    <script src="public/assets/js/main.js"></script>
    <script src="public/assets/plugins/less/dist/less.min.js"></script>
</head>
<body>
    <div class="container">
        <h1>Conversor de Moedas</h1>
        <div class="row justify-content-center main">
            <div class="col-1"></div>
            <div class="col-4">
                <div class="form-group row">
                    <div class="col-sm-4">
                        <div class="dropdown">
                            <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="public/assets/images/usd.png" class='currency-image-1' /> <span class='currency-symbol-1'>USD</span>
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="#" onClick="activeCurrency('usd','$',1);"><img src="public/assets/images/usd.png" /> <span>USD</span></a>
                                <a class="dropdown-item" href="#" onClick="activeCurrency('brl','R$',1);"><img src="public/assets/images/brl.png" /> <span>BRL</span></a>
                                <a class="dropdown-item" href="#" onClick="activeCurrency('eur','&euro;',1);"><img src="public/assets/images/eur.png" /> <span>EUR</span></a>
                                <a class="dropdown-item" href="#" onClick="activeCurrency('btc','$',1);"><img src="public/assets/images/btc.png" /> <span>BTC</span></a>
                                <a class="dropdown-item" href="#" onClick="activeCurrency('eth','$',1);"><img src="public/assets/images/eth.png" /> <span>ETH</span></a>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-8">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">$</span>
                            </div>
                            <input type="text" class="form-control fromCurrency" aria-label="From" aria-describedby="basic-addon1" value="1.00">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-2 arrow">&rarr;</div>
            <div class="col-4">
                <div class="form-group row">
                    <div class="col-sm-4">
                        <div class="dropdown">
                            <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="public/assets/images/brl.png" class='currency-image-2' /> <span class='currency-symbol-2'>BRL</span>
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="#" onClick="activeCurrency('usd','$',2);"><img src="public/assets/images/usd.png" /> <span>USD</span></a>
                                <a class="dropdown-item" href="#" onClick="activeCurrency('brl','R$',2);"><img src="public/assets/images/brl.png" /> <span>BRL</span></a>
                                <a class="dropdown-item" href="#" onClick="activeCurrency('eur','&euro;',2);"><img src="public/assets/images/eur.png" /> <span>EUR</span></a>
                                <a class="dropdown-item" href="#" onClick="activeCurrency('btc','$',2);"><img src="public/assets/images/btc.png" /> <span>BTC</span></a>
                                <a class="dropdown-item" href="#" onClick="activeCurrency('eth','$',2);"><img src="public/assets/images/eth.png" /> <span>ETH</span></a>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-8">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon2">R$</span>
                            </div>
                            <input type="text" readonly class="form-control toCurrency" placeholder="" aria-label="To" aria-describedby="basic-addon2" value="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-1"></div>
        </div>
    </div>
</body>
</html>