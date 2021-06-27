'''

util.py

Utility functions

'''
# Python default package imports
import difflib
import os
import re
import sys
import shutil

# Third-party package imports
import requests
import goodlogging

############################################################################
# RemoveEmptyDirectoryTree
# Delete tree of empty directories
############################################################################
def RemoveEmptyDirectoryTree(path, silent = False, recursion = 0):
  if not silent and recursion is 0:
    goodlogging.Log.Info("UTIL", "Starting removal of empty directory tree at: {0}".format(path))
  try:
    os.rmdir(path)
  except OSError:
    if not silent:
      goodlogging.Log.Info("UTIL", "Removal of empty directory tree terminated at: {0}".format(path))
    return
  else:
    if not silent:
      goodlogging.Log.Info("UTIL", "Directory deleted: {0}".format(path))
    RemoveEmptyDirectoryTree(os.path.dirname(path), silent, recursion + 1)

############################################################################
# CheckPathExists
#
############################################################################
def CheckPathExists(path):
  i = 0
  root, ext = os.path.splitext(path)
  while os.path.exists(path):
    i = i + 1
    goodlogging.Log.Info("UTIL", "Path {0} already exists".format(path))
    path = "{0}_{1}".format(root, i) + ext
  return path

############################################################################
# StripSpecialCharacters
# Strips special characters, duplicate spaces and post/pre-ceeding spaces
# This will only strip single spaces, periods, hyphens and underscores
# if stripAll is set
############################################################################
def StripSpecialCharacters(string, stripAll = False):
  goodlogging.Log.Info("UTIL", "Stripping any special characters from {0}".format(string), verbosity=goodlogging.Verbosity.MINIMAL)
  string = string.strip()
  string = re.sub('[&]', 'and', string)
  string = re.sub('[@#$%^&*{};:,/<>?\|`~=+]', '', string)
  string = re.sub('\s\s+', ' ', string)

  if stripAll:
    string = re.sub('[_.-]', '', string)
    string = re.sub('\s', '', string)

  goodlogging.Log.Info("UTIL", "New string is: {0}".format(string), verbosity=goodlogging.Verbosity.MINIMAL)
  return string

#################################################
# CheckEmptyResponse
#################################################
def CheckEmptyResponse(response):
  while response.strip() == '':
    response = goodlogging.Log.Input("RENAMER", "An empty response was detected - please reenter a valid response: ")
  return response

#################################################
# ValidUserResponse
#################################################
def ValidUserResponse(response, validList):
  if response in validList:
    return response
  else:
    prompt = "Unknown response given - please reenter one of [{0}]: ".format('/'.join(validList))
    response = goodlogging.Log.Input("DM", prompt)
    return ValidUserResponse(response, validList)

############################################################################
# UserAcceptance
############################################################################
def UserAcceptance(
  matchList,
  recursiveLookup = True,
  promptComment = None,
  promptOnly = False,
  xStrOverride = "to skip this selection"
):
  matchString = ', '.join(matchList)

  if len(matchList) == 1:
    goodlogging.Log.Info("UTIL", "Match found: {0}".format(matchString))
    prompt = "Enter 'y' to accept this match or e"
  elif len(matchList) > 1:
    goodlogging.Log.Info("UTIL", "Multiple possible matches found: {0}".format(matchString))
    prompt = "Enter correct match from list or e"
    option = 2
  else:
    if promptOnly is False:
      goodlogging.Log.Info("UTIL", "No match found")
    prompt = "E"
    if not recursiveLookup:
      return None

  if recursiveLookup:
    prompt = prompt + "nter a different string to look up or e"

  prompt = prompt + "nter 'x' {0} or enter 'exit' to quit this program".format(xStrOverride)

  if promptComment is None:
    prompt = prompt + ": "
  else:
    prompt = prompt + " ({0}): ".format(promptComment)

  while(1):
    response = goodlogging.Log.Input('UTIL', prompt)

    if response.lower() == 'exit':
      goodlogging.Log.Fatal("UTIL", "Program terminated by user 'exit'")
    if response.lower() == 'x':
      return None
    elif response.lower() == 'y' and len(matchList) == 1:
      return matchList[0]
    elif len(matchList) > 1:
      for match in matchList:
        if response.lower() == match.lower():
          return match
    if recursiveLookup:
      return response

############################################################################
# GetBestMatch
# This finds the elements of matchList which best match the target string
# Note that this searches substrings so "abc" will have a 100% match in
# both "this is the abc", "abcde" and "abc"
# The return from this function is a list of potention matches which shared
# the same highest match score. If any exact match is found (1.0 score and
# equal size string) this will be given alone.
############################################################################
def GetBestMatch(target, matchList):
  bestMatchList = []

  if len(matchList) > 0:
    ratioMatch = []
    for item in matchList:
      ratioMatch.append(GetBestStringMatchValue(target, item))

    maxRatio = max(ratioMatch)
    if maxRatio > 0.8:
      matchIndexList = [i for i, j in enumerate(ratioMatch) if j == maxRatio]

      for index in matchIndexList:
        if maxRatio == 1 and len(matchList[index]) == len(target):
          return [matchList[index], ]
        else:
          bestMatchList.append(matchList[index])

  return bestMatchList

############################################################################
# GetBestStringMatchValue
############################################################################
def GetBestStringMatchValue(string1, string2):
  # Ignore case
  string1 = string1.lower()
  string2 = string2.lower()

  # Ignore non-alphanumeric characters
  string1 = ''.join(i for i in string1 if i.isalnum())
  string2 = ''.join(i for i in string2 if i.isalnum())

  # Finding best match value between string1 and string2
  if len(string1) == 0 or len(string2) == 0:
    bestRatio = 0
  elif len(string1) == len(string2):
    match = difflib.SequenceMatcher(None, string1, string2)
    bestRatio = match.ratio()
  else:
    if len(string1) > len(string2):
      shortString = string2
      longString = string1
    else:
      shortString = string1
      longString = string2

    match = difflib.SequenceMatcher(None, shortString, longString)
    bestRatio = match.ratio()

    for block in match.get_matching_blocks():
      subString = longString[block[1]:block[1]+block[2]]
      subMatch = difflib.SequenceMatcher(None, shortString, subString)
      if(subMatch.ratio() > bestRatio):
        bestRatio = subMatch.ratio()

  return(bestRatio)

############################################################################
# WebLookup
# Default encoding is UTF8
############################################################################
def WebLookup(url, urlQuery=None, utf8=True):
  # Look up webpage at given url with optional query string
  goodlogging.Log.Info("UTIL", "Looking up info from URL:{0} with QUERY:{1})".format(url, urlQuery), verbosity=goodlogging.Verbosity.MINIMAL)
  response = requests.get(url, params=urlQuery)
  goodlogging.Log.Info("UTIL", "Full url: {0}".format(response.url), verbosity=goodlogging.Verbosity.MINIMAL)
  if utf8 is True:
    response.encoding = 'utf-8'
  if(response.status_code == requests.codes.ok):
    return(response.text)
  else:
    response.raise_for_status()

############################################################################
# ArchiveProcessedFile
# Move file to archive directory (by default this is 'PROCESSED')
############################################################################
def ArchiveProcessedFile(filePath, archiveDir):
  targetDir = os.path.join(os.path.dirname(filePath), archiveDir)
  goodlogging.Log.Info("UTIL", "Moving file to archive directory:")
  goodlogging.Log.IncreaseIndent()
  goodlogging.Log.Info("UTIL", "FROM: {0}".format(filePath))
  goodlogging.Log.Info("UTIL", "TO:   {0}".format(os.path.join(targetDir, os.path.basename(filePath))))
  goodlogging.Log.DecreaseIndent()
  os.makedirs(targetDir, exist_ok=True)
  try:
    shutil.move(filePath, targetDir)
  except shutil.Error as ex4:
    err = ex4.args[0]
    goodlogging.Log.Info("UTIL", "Move to archive directory failed - Shutil Error: {0}".format(err))

############################################################################
# FileExtensionMatch
# Check whether the file matches any of the supported file types
############################################################################
def FileExtensionMatch(filePath, supportedFileTypeList):
  return (os.path.splitext(filePath)[1] in supportedFileTypeList)

