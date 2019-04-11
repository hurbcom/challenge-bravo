# -*- coding: utf-8 -*-
from setuptools import find_packages, setup

__version__             = '0.1.0'
__description__         = 'Api Python Flask'
__long_description__    = 'This is an API to convert coins'

__author__              = 'Gilvan Almeida'
__author_email__        = 'g6almeida@hotmail.com'

setup(
    name            ='api',
    version         =__version__,
    author          =__author__,
    author_email    =__author_email__,
    packages        =find_packages(),
    license         ='MIT',
    description     =__description__,
    long_description=__long_description__,
    url             ='',
    keywords        ='API',
    include_package_data=True,
    zip_safe            =False,
    classifiers=[
        'Intended Audience :: Developers',
        'Intended Audience :: System Administrators',
        'Operating System :: OS Independent',
        'Topic :: Software Development',
        'Environment :: Web Environment',
        'Programming Language :: Python :: 3.6',
        'License :: OSI Approved :: MIT License',
    ],
)
