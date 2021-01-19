PaginationSchema = {
    "pageNumber": {"type": ["integer", "string"], "min": 1, "coerce": int},
    "pageSize": {"type": ["integer", "string"], "min": 1, "coerce": int},
    "ordering": {"type": ["string"]},
}
