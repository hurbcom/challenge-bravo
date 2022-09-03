from fastapi import APIRouter, status



router = APIRouter(
    prefix="/quote",
    tags=["quote"]
)

@router.get("/", status_code=status.HTTP_200_OK)
def read_quotes():
    """ Return all currencies in both oficial and fantasy tables """
    pass


@router.get("/{currency_code}", status_code=status.HTTP_200_OK)
def read_quote(currency_code: str):
    """ Return one specific currency information """
    pass


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_quote():
    """ Create new quote in `fantasy_coins` table """


@router.put("/{currency_code}", status_code=status.HTTP_200_OK)
def update_quote(currency_code: str):
    """ Updates existing quote in `fantasy_coins` """
    pass


@router.delete("/{currency_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quote(currency_code: str):
    """ Deletes existing quote in `fantasy_coins` table """
    pass