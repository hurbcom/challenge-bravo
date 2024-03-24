run:
	uvicorn app.main:app --reload
coverage:
	coverage run -m unittest
	coverage report --fail-under 99
	coverage html

integration_tests:
	robot tests/integration
