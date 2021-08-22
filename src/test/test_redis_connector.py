import unittest
import src.redis_connector as RC


class RedisConnectorTestSuite(unittest.TestCase):
    def test_successful_connection(self):
        connector = RC.RedisConnector()
        conn = connector.get_connection()
        self.assertEqual(type(conn).__name__, 'Redis')
