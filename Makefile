run:
	uvicorn app.main:app --reload
coverage:
	coverage run -m unittest
	coverage report
	coverage html

integration_tests:
	robot tests/integration
