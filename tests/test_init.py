from desafio.app import create_app
from desafio.settings import TestConfig


def test_config():
    assert create_app(TestConfig).testing


def test_init_db_command(runner, monkeypatch):
    class Recorder:
        called = False

    def fake_init_db():
        Recorder.called = True

    monkeypatch.setattr("desafio.commands.init_db", fake_init_db)
    result = runner.invoke(args=["init-db"])
    assert "Initialized" in result.output
    assert Recorder.called
