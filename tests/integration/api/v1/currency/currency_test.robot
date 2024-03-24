*** Settings ***
Documentation     A test suite for valid login.
...
...               Keywords are imported from the resource file
Resource          keywords.resource

*** Test Cases ***
Return quotation success
    Given I need to get a quotation from usd to brl
    When When the value to be quotated in the api was passed
    Then Return the quotation value

Create new Currency
    Given I need a new currency to get quotations
    When I try to create a new in the api
    Then The Currency is created and returned they id
