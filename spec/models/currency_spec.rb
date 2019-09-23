require 'rails_helper'

describe Currency do
  describe '#ballest' do
    before do
      allow_any_instance_of(described_class).to receive(:test_integrity_with_conversor_service)
    end

    context 'when exist' do
      before { create(:currency_ballast) }

      it { expect(described_class.ballast.present?).to be true }
    end

    context 'when not exist' do
      before { create(:currency) }
      
      it { expect(described_class.ballast.present?).to be false }
    end
  end

  describe '#validate_default' do
    before do
      allow_any_instance_of(described_class).to receive(:test_integrity_with_conversor_service)
    end

    subject do
      record.valid?
      record.errors.messages
    end

    describe 'with already created ballest' do
      before { create(:currency_ballast) }

      context 'when try to update ballest' do
        let!(:record) do
          ballest = described_class.ballast.first
          ballest.default = false

          ballest
        end

        let(:expection) do
          {
            default: ['you can\'t change default option!!!']
          }
        end

        it { is_expected.to match expection }
      end


      context 'when try create another one' do
        let!(:record) do
          described_class.new(
            code: 'BRL',
            symbol: 'R$',
            name: 'Real',
            country: 'Brasil',
            default: true
          )
        end

        let(:expection) do
          {
            default: ['ballast already setted!!!']
          }
        end

        it { is_expected.to match expection }
      end
    end

    describe 'when not exist ballest' do
      let!(:record) do
        described_class.new(
          code: 'BRL',
          symbol: 'R$',
          name: 'Real',
          country: 'Brasil',
          default: true
        )
      end

      it { is_expected.to be {} }
    end
  end

  describe '#test_integrity_with_conversor_service' do
    before do
      allow_any_instance_of(EuCentralBank).to receive(:update_rates)
    end

    subject do
      described_class.create!(code: 'EUR', symbol: '€', name: 'Euro', country: 'Euro Member')
    end

    context 'When something wrong happend' do
      before do
        allow_any_instance_of(CurrencyConversorService).to receive(:execute).and_raise(
          StandardError
        )
      end

      it { expect { subject }.to raise_error Currency::CreateTestIntegrityError }
    end

    context 'When nothing wrong happend' do
      before { allow_any_instance_of(CurrencyConversorService).to receive(:execute) }

      it { expect { subject }.to change { described_class.count }.to(1) }
    end
  end

  describe '#validate_permited_to_destroy' do
    before do
      allow_any_instance_of(described_class).to receive(:test_integrity_with_conversor_service)
    end
    
    context 'when success' do
      subject do
        currency = create(:currency)
        currency.destroy!
      end

      it { expect { subject }.to_not raise_error Currency::NotAllowedToDestroyError }
    end

    context 'when NotAllowedToDestroyError' do 
      subject do
        currency = create(:currency_ballast)
        currency.destroy!
      end

      it { expect { subject }.to raise_error Currency::NotAllowedToDestroyError }
    end
  end
end
