from fastapi import APIRouter, status



router = APIRouter(
    prefix="/favorite",
    tags=["favorite"]
)

@router.get("/", status_code=status.HTTP_200_OK)
def read_all_favorites():
    """ Returns all currencies from `favorite_coins` table """
    pass


@router.get("/{currency_code}", status_code=status.HTTP_200_OK)
def read_favorite():
    """ Returns a specific currency from `favorite_coins` table """
    pass


@router.post("/{currency_code}", status_code=status.HTTP_201_CREATED)
def add_favorite():
    """ Add currency from `favorite_coins` table if found in `oficial_coins` or `fantasy_coins` tables """
    pass


@router.delete("/{currency_code}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite():
    """ Remove currency from `favorite_coins` table """
    pass