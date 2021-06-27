'''

goodlogging

This logging package provides some additional functionality
to command line utilities. These include:

* Easy indentation of displayed lines
* Configurable verbosity levels
* Optional identifying tags on every message
* Easily trigger ERROR or FATAL messages (where fatal exits the program)
* Input method for getting user response from the command line
* Add consistent seperators or newlines to the displayed output

'''

import sys
from enum import Enum

#################################################
# Verbosity
#
# Enumerated class allowing different info
# verbosity levels.
#
#################################################
class Verbosity(Enum):
  MINIMAL = 1
  NORMAL = 2
  ALWAYS = 3

#################################################
# Log
#
# Logging class object
#
# var tagsEnabled - Enable/Disable tags
# var maxTagSize - Maximum tag size (used to adjust
#                  text alignment with tags enabled)
# var indent - Indent count
# var indentSize  - Indent size (e.g. number of spaces)
# var verbosityThreshold - Set verbosity level
#
#################################################
class Log(object):
  tagsEnabled = 0
  maxTagSize = 8
  indent = 0
  indentSize = '  '
  verbosityThreshold = Verbosity.NORMAL

  ############################################################################
  # IncreaseIndent - increase indent shown on command line
  ############################################################################
  @classmethod
  def IncreaseIndent(cls):
    cls.indent = cls.indent + 1

  ############################################################################
  # ResetIndent - reset indent shown on command line to 0 (no ident)
  ############################################################################
  @classmethod
  def ResetIndent(cls):
    cls.indent = 0

  ############################################################################
  # DecreaseIndent - decrease indent shown on command line
  ############################################################################
  @classmethod
  def DecreaseIndent(cls):
    cls.indent = cls.indent - 1
    if cls.indent < 0:
      cls.indent = 0

  ############################################################################
  # CreateString - convert given string into a Logzilla string by adding the
  #                tag and the correct indent.
  #                The ident is given by indent * indentSise
  ############################################################################
  @classmethod
  def CreateString(cls, tag, string):
    returnString = ""
    if cls.tagsEnabled:
      tag = tag[0:cls.maxTagSize].upper()
      returnString = "[{0}]{1}".format(tag, ' '*(cls.maxTagSize-len(tag)))
    returnString = returnString + "{0}{1}".format(cls.indent*cls.indentSize, string)
    return returnString

  ############################################################################
  # Info - display message if message verbosity is greater than threshold
  ############################################################################
  @classmethod
  def Info(cls, tag, string, verbosity=Verbosity.ALWAYS):
    if(verbosity.value >= cls.verbosityThreshold.value):
      print(cls.CreateString(tag, string))

  ############################################################################
  # Error - display ERROR message
  ############################################################################
  @classmethod
  def Error(cls, tag, string):
    cls.Info(tag, "ERROR: " + string, verbosity=Verbosity.ALWAYS)

  ############################################################################
  # Fatal - display FATAL message and exit program
  ############################################################################
  @classmethod
  def Fatal(cls, tag, string):
    cls.Info(tag, "FATAL: " + string, verbosity=Verbosity.ALWAYS)
    sys.exit(0)

  ############################################################################
  # Input - display message and return user response
  ############################################################################
  @classmethod
  def Input(cls, tag, string):
    response = input(cls.CreateString(tag, string))
    return response

  ############################################################################
  # Seperator - display seperator bar
  ############################################################################
  @staticmethod
  def Seperator():
    print("\n*** -------------------------------- ***")

  ############################################################################
  # NewLine - display blank line
  ############################################################################
  @staticmethod
  def NewLine():
    print("")
