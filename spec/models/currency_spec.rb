require 'rails_helper'

describe Currency do
  describe '#ballest' do
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
end
