require 'money'

Money.infinite_precision = true
Money.locale_backend = :currency

ethereum = {
  priority:            3,
  iso_code:            "ETH",
  iso_numeric:         "18",
  name:                "Ethereum",
  symbol:              "Ξ",
  subunit:             "CEther",
  subunit_to_unit:     100,
  decimal_mark:        ".",
  thousands_separator: ","
}

bitcoin = {
  priority:            2,
  iso_code:            "BTC",
  iso_numeric:         "8",
  name:                "Bitcoin",
  symbol:              "Ƀ",
  subunit:             "bitcent",
  subunit_to_unit:     100,
  decimal_mark:        ".",
  thousands_separator: ","
}

Money::Currency.register(ethereum)
Money::Currency.register(bitcoin)