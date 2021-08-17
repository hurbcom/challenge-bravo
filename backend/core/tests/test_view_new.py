from django.test import TestCase

from backend.core.models import MyCoin


class NewTeste(TestCase):
    def setUp(self):
        self.mycoin = MyCoin.objects.create(
            codecoin='HURB',
            namecoin='Hurb Coin',
            price=5
        )

    def test_create(self):
        """Should be MyCoin exists"""
        self.assertTrue(MyCoin.objects.exists())

    def test_codecoin_can_be_not_blank(self):
        field = MyCoin._meta.get_field('codecoin')
        self.assertFalse(field.blank)

    def test_namecoin_can_be_not_blank(self):
        field = MyCoin._meta.get_field('namecoin')
        self.assertFalse(field.blank)

    def test_price_can_be_not_blank(self):
        field = MyCoin._meta.get_field('price')
        self.assertFalse(field.blank)

    def test_str(self):
        self.assertEqual('HURB', str(self.mycoin))
