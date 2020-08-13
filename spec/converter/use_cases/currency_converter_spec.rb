require 'spec_helper'

describe Converter::UseCases::CurrencyConverter do
  let(:conversion_api) { double("ConversionApi")}
  let(:currency_repository) { double("CurrencyRepository")}
  let(:to) { "ETH" }
  let(:from) { "EUR" }
  let(:ballast) { "USD" }
  let(:amount) { 4242 }
  let(:to_currency) { double("Currency") }
  let(:ballast_currency) { double("Currency") }
  let(:from_currency) { double("Currency") }
  let(:quotation) { double("Quotation") }
  let(:currency_converter) {
    described_class.new(
      conversion_api: conversion_api,
      currency_repository: currency_repository
    )
  }

  describe '#execute' do
    before(:each) do
      allow(currency_repository).to receive(:find_by_code).with(from).and_return(from_currency)
      allow(currency_repository).to receive(:find_by_code).with(to).and_return(to_currency)
      allow(currency_repository).to receive(:find_ballast).and_return(ballast_currency)
      allow(from_currency).to receive(:code).and_return(from)
      allow(to_currency).to receive(:code).and_return(to)
      allow(ballast_currency).to receive(:code).and_return(ballast)
      allow(conversion_api).to receive(:get_exchange_rate).with(from: from, to: to, ballast: ballast).and_return(quotation)
      allow(quotation).to receive(:calculate).with(amount: amount)
    end

    after(:each) do
      currency_converter.execute(from: from, to: to, amount: amount)
    end

    it "fetches the conversion rate and calculates the currency conversion" do
      expect(currency_repository).to receive(:find_by_code).with(from).and_return(from_currency)
      expect(currency_repository).to receive(:find_by_code).with(to).and_return(to_currency)
      expect(currency_repository).to receive(:find_ballast).and_return(ballast_currency)
      expect(from_currency).to receive(:code).and_return(from)
      expect(to_currency).to receive(:code).and_return(to)
      expect(ballast_currency).to receive(:code).and_return(ballast)
      expect(conversion_api).to receive(:get_exchange_rate).with(from: from, to: to, ballast: ballast).and_return(quotation)
      expect(quotation).to receive(:calculate).with(amount: amount)
    end
  end

end
