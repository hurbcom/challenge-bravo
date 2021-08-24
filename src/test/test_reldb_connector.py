from src.reldb_connector import RelationalDBConnector
import unittest


class RelationalDBConnectorTestSuite(unittest.TestCase):
    def test_successful_connection_and_add_test_currency(self):
        connector = RelationalDBConnector()
        conn = connector.get_connection()
        cursor = conn.cursor()
        cursor.execute(''' 
            INSERT INTO USER_CURRENCY (NAME, BASE_VALUE)
            VALUES ('TEST', 1.2)
            ON CONFLICT DO NOTHING;
        ''')
        conn.commit()
        self.assertEqual(type(conn).__name__, 'Connection')
