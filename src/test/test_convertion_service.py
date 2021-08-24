from src.convertion_service import ConvertionService
import unittest

service = ConvertionService()


class ConvertionServiceTestSuite(unittest.TestCase):
    def test_all_real_service(self):
        real_currencies = service.get_all_real_currencies()
        self.assertTrue(len(real_currencies['currencies']) > 0)

    def test_get_all_user_created_currencies(self):
        user_created_currencies = service.get_all_user_created_currencies()
        self.assertTrue(len(user_created_currencies['currencies']) > 0)

    def test_get_all_currencies(self):
        all_currencies = service.get_all_currencies()
        self.assertTrue(all_currencies['currencies'].index('USD') >= 0)
        self.assertTrue(all_currencies['currencies'].index('TEST') >= 0)
