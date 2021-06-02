test:
	TEST_ENV=True poetry run pytest tests --cov --cov-report term-missing
