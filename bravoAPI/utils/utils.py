def is_int_or_float(s):
    ''' return 1 for int, 2 for float, -1 for not a number '''
    try:
        float(s)
        return 1 if s.count('.') == 0 else 2
    except ValueError:
        return -1