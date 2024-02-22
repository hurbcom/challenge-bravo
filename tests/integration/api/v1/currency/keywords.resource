*** Settings ***
Library           test_currency_utils.py

*** Variables ***
${BASE_URL}     http://localhost:8000/api/v1/currency


*** Keywords ***
I need to get a quotation from usd to brl
    Set Test Variable    ${dolar}     USD
    Set Test Variable    ${real}     BRL
    Set Test Variable    ${amount}     100

When the value to be quotated in the api was passed
    ${response}     Get Currency    ${BASE_URL}     ${dolar}     ${real}     ${amount}
    Set Test Variable    ${response}

Return the quotation value
    Validate Get Currency Response     ${response}

I need a new currency to get quotations
    Set Test Variable    ${acronym}     GTA$
    Set Test Variable    ${name}     GTA_currency

I try to create a new in the api
    ${response}     Create Currency    ${BASE_URL}     ${acronym}     ${name}
    Set Test Variable    ${response}

The Currency is created and returned they id
    Validate Create Currency Response     ${response}
