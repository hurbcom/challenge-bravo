run:
	uvicorn app.main:app --reload
coverage:
	coverage run -m unittest discover
	coverage report
	coverage html
