from visualization_demo.app import get_connection, get_sensor_data


class TestDatabase:
    def test_database(self):
        # verify that the connection is not None
        assert get_connection() is not None

    def test_get_sensor_data(self):
        # verify that the data is not None
        results = get_sensor_data()
        assert results is not None