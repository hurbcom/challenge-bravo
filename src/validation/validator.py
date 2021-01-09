from typing import Dict, Optional
from cerberus import Validator


class BravoValidator(Validator):
    pass


def is_valid(schema: Dict, data: Optional[Dict] = None) -> Dict:
    data = data if data else {}
