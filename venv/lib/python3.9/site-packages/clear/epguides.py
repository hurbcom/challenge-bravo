'''

epguides.py

Lookup TV guide information from epguides

'''
# Python default package imports
import os
import glob
import csv
import datetime

# Third-party package imports
import goodlogging

# Local file imports
import clear.util as util

#################################################
# EPGuidesLookup
#################################################
class EPGuidesLookup:
  GUIDE_NAME = 'EPGUIDES'
  ALLSHOW_IDLIST_URL = 'http://epguides.com/common/allshows.txt'
  EPISODE_LOOKUP_URL = 'http://epguides.com/common/exportToCSVmaze.asp'
  ID_LOOKUP_TAG = 'TVmaze'
  EP_LOOKUP_TAG = 'maze'

  logVerbosity = goodlogging.Verbosity.MINIMAL

  #################################################
  # constructor
  #################################################
  def __init__(self):
    self._allShowList = None
    self._showInfoDict = {}
    self._showTitleList = None
    self._showIDList = None
    self._saveDir = os.getcwd()

  # *** INTERNAL CLASSES *** #
  ############################################################################
  # _ParseShowList
  # Read self._allShowList as csv file and make list of titles and IDs
  # If checkOnly is True this will only check to ensure the column headers
  # can be extracted correctly.
  ############################################################################
  def _ParseShowList(self, checkOnly=False):
    showTitleList = []
    showIDList = []

    csvReader = csv.reader(self._allShowList.splitlines())
    for rowCnt, row in enumerate(csvReader):
      if rowCnt == 0:
        # Get header column index
        for colCnt, column in enumerate(row):
          if column == 'title':
            titleIndex = colCnt
          if column == self.ID_LOOKUP_TAG:
            lookupIndex = colCnt
      else:
        try:
          showTitleList.append(row[titleIndex])
          showIDList.append(row[lookupIndex])
        except UnboundLocalError:
          goodlogging.Log.Fatal("EPGUIDE", "Error detected in EPGUIDES allshows csv content")
        else:
          if checkOnly and rowCnt > 1:
            return True
    self._showTitleList = showTitleList
    self._showIDList = showIDList
    return True

  ############################################################################
  # _GetAllShowList
  # Populates self._allShowList with the EPGuides all show info
  # On the first lookup for a day the information will be loaded from
  # the EPGuides url. This will be saved to local file _epguides_YYYYMMDD.csv
  # and any old files will be removed. Subsequent accesses for the same day
  # will read this file.
  ############################################################################
  def _GetAllShowList(self):
    today = datetime.date.today().strftime("%Y%m%d")
    saveFile = '_epguides_' + today + '.csv'
    saveFilePath = os.path.join(self._saveDir, saveFile)
    if os.path.exists(saveFilePath):
      # Load data previous saved to file
      with open(saveFilePath, 'r') as allShowsFile:
        self._allShowList = allShowsFile.read()
    else:
      # Download new list from EPGUIDES and strip any leading or trailing whitespace
      self._allShowList = util.WebLookup(self.ALLSHOW_IDLIST_URL).strip()

      if self._ParseShowList(checkOnly=True):
        # Save to file to avoid multiple url requests in same day
        with open(saveFilePath, 'w') as allShowsFile:
          goodlogging.Log.Info("EPGUIDE", "Adding new EPGUIDES file: {0}".format(saveFilePath), verbosity=self.logVerbosity)
          allShowsFile.write(self._allShowList)

        # Delete old copies of this file
        globPattern = '_epguides_????????.csv'
        globFilePath = os.path.join(self._saveDir, globPattern)
        for filePath in glob.glob(globFilePath):
          if filePath != saveFilePath:
            goodlogging.Log.Info("EPGUIDE", "Removing old EPGUIDES file: {0}".format(filePath), verbosity=self.logVerbosity)
            os.remove(filePath)

  ############################################################################
  # _GetTitleAndIDList
  # Get title and id lists from EPGuides all show info
  ############################################################################
  def _GetTitleAndIDList(self):
    # Populate self._allShowList if it does not already exist
    if self._allShowList is None:
      self._GetAllShowList()
    self._ParseShowList()

  ############################################################################
  # _GetTitleList
  # Generate title list if it does not already exist
  ############################################################################
  def _GetTitleList(self):
    if self._showTitleList is None:
      self._GetTitleAndIDList()

  ############################################################################
  # _GetIDList
  # PGenerate id list if it does not already exist
  ############################################################################
  def _GetIDList(self):
    if self._showIDList is None:
      self._GetTitleAndIDList()

  ############################################################################
  # _GetShowID
  # Get EPGuides ID for showName
  ############################################################################
  def _GetShowID(self, showName):
    self._GetTitleList()
    self._GetIDList()

    for index, showTitle in enumerate(self._showTitleList):
      if showName == showTitle:
        return self._showIDList[index]
    return None

  ############################################################################
  # _ExtractDataFromShowHtml
  # Extracts show data from html source
  # Uses line iteration to extract <pre>...</pre> data block rather than xml
  # because (1) The HTML text can include illegal xml characters (e.g. &)
  #         (2) Using XML parsing opens up attack opportunity
  ############################################################################
  def _ExtractDataFromShowHtml(self, html):
    htmlLines = html.splitlines()
    for count, line in enumerate(htmlLines):
      if line.strip() == r'<pre>':
        startLine = count+1
      if line.strip() == r'</pre>':
        endLine = count

    try:
      dataList = htmlLines[startLine:endLine]
      dataString = '\n'.join(dataList)
      return dataString.strip()
    except:
      raise Exception("Show content not found - check EPGuides html formatting")

  ############################################################################
  # _GetEpisodeName
  # Get episode name from EPGuides show info
  ############################################################################
  def _GetEpisodeName(self, showID, season, episode):
    # Load data for showID from dictionary
    showInfo = csv.reader(self._showInfoDict[showID].splitlines())
    for rowCnt, row in enumerate(showInfo):
      if rowCnt == 0:
        # Get header column index
        for colCnt, column in enumerate(row):
          if column == 'season':
            seasonIndex = colCnt
          if column == 'episode':
            episodeIndex = colCnt
          if column == 'title':
            titleIndex = colCnt
      else:
        # Iterate rows until matching season and episode found
        try:
          int(row[seasonIndex])
          int(row[episodeIndex])
        except ValueError:
          # Skip rows which don't provide integer season or episode numbers
          pass
        else:
          if int(row[seasonIndex]) == int(season) and int(row[episodeIndex]) == int(episode):
            goodlogging.Log.Info("EPGUIDE", "Episode name is {0}".format(row[titleIndex]), verbosity=self.logVerbosity)
            return row[titleIndex]
    return None

  # *** EXTERNAL CLASSES *** #
  ############################################################################
  # ShowNameLookUp
  # Get closest show name match to a given string
  ############################################################################
  def ShowNameLookUp(self, string):
    goodlogging.Log.Info("EPGUIDES", "Looking up show name match for string '{0}' in guide".format(string), verbosity=self.logVerbosity)
    self._GetTitleList()
    showName = util.GetBestMatch(string, self._showTitleList)
    return(showName)

  ############################################################################
  # EpisodeNameLookUp
  # Get the episode name correspondng to the given show name, season number
  # and episode number
  ############################################################################
  def EpisodeNameLookUp(self, showName, season, episode):
    goodlogging.Log.Info("EPGUIDE", "Looking up episode name for {0} S{1}E{2}".format(showName, season, episode), verbosity=self.logVerbosity)
    goodlogging.Log.IncreaseIndent()
    showID = self._GetShowID(showName)
    if showID is not None:
      try:
        self._showInfoDict[showID]
      except KeyError:
        goodlogging.Log.Info("EPGUIDE", "Looking up info for new show: {0}(ID:{1})".format(showName, showID), verbosity=self.logVerbosity)
        urlData = util.WebLookup(self.EPISODE_LOOKUP_URL, {self.EP_LOOKUP_TAG: showID})
        self._showInfoDict[showID] = self._ExtractDataFromShowHtml(urlData)
      else:
        goodlogging.Log.Info("EPGUIDE", "Reusing show info previous obtained for: {0}({1})".format(showName, showID), verbosity=self.logVerbosity)
      finally:
        episodeName = self._GetEpisodeName(showID, season, episode)
        goodlogging.Log.DecreaseIndent()
        return episodeName
    goodlogging.Log.DecreaseIndent()
