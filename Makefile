test:
	TEST_ENV=True poetry run pytest tests --cov --cov-report term-missing

export:
	poetry export -f requirements.txt > requirements.txt

export_dev:
	poetry export --dev -f requirements.txt > requirements.txt
