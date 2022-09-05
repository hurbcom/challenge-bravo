def test_root(client):
    """ Makes a request to root URI """
    res = client.get("/")
    assert res.status_code == 200