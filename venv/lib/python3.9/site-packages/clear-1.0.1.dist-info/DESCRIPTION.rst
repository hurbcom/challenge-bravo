CLEAR
==================

**C**\ ommand-**L**\ ine **E**\ xtract **A**\ nd **R**\ ename utility

This provides a media library manager that allows extraction and renaming of
media files.

Currently supported functionality:

- Extraction of video files from RAR packages
- Renaming of TV episodes using epguides

Installation
---------------
Install using pip:

.. code-block:: bash

    $ pip install clear

Example
-------
If installed using pip you can run this script using:

.. code-block:: bash

  python -m clear <ARGS>

To see available arguments use the help option:

.. code-block:: bash

  python -m clear --help

If running directly from the source the wrapper clear-runner script can be used:

.. code-block:: bash

  python clear-runner.py <ARGS>

Requirements
---------------
This is a python package and requires the following:

- Python 3.4+
- Python requests package
- Python rarfile package
- Python goodlogging package

Requests, Issues, Bugs or Suggestions
---------------------------------------------
Add any feature requests, issues, bugs or suggestions here: https://github.com/davgeo/clear/issues

Please give as much detail as possible.


