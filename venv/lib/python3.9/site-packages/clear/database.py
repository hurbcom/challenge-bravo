'''

database.py

SQLite database control

'''
# Python default package imports
import sqlite3
import os
import re

# Third-party package imports
import goodlogging

# Local file imports
import clear.util as util

#################################################
# RenamerDB
#################################################
class RenamerDB:
  logVerbosity = goodlogging.Verbosity.MINIMAL

  #################################################
  # constructor
  #################################################
  def __init__(self, dbPath):
    self._dbPath = dbPath

    self._tableDict = {"Config": ('Name', 'Value'),
                       "IgnoredDir": ('DirName',),
                       "SupportedFormat": ('FileFormat',),
                       "TVLibrary": ('ShowID', 'ShowName', 'ShowDir'),
                       "FileName": ('ShowID', 'ShowDir'),
                       "SeasonDir": ('ShowID', 'Season', 'SeasonDir')}

    if not os.path.exists(self._dbPath):
      self._CreateDatabase()
    elif not os.path.isfile(self._dbPath):
      goodlogging.Log.Fatal("DB", "Database path exists but it is not a file: {0}".format(self._dbPath))

  #################################################
  # _CreateDatabase
  #################################################
  def _CreateDatabase(self):
    goodlogging.Log.Info("DB", "Initialising new database", verbosity=self.logVerbosity)

    with sqlite3.connect(self._dbPath) as db:
      # Configuration tables
      db.execute("CREATE TABLE Config ("
                  "Name TEXT UNIQUE NOT NULL, "
                  "Value TEXT)")

      db.execute("CREATE TABLE IgnoredDir ("
                  "DirName TEXT UNIQUE NOT NULL)")

      db.execute("CREATE TABLE SupportedFormat ("
                  "FileFormat TEXT UNIQUE NOT NULL)")

      # Look-up tables
      db.execute("CREATE TABLE TVLibrary ("
                  "ShowID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
                  "ShowName TEXT UNIQUE NOT NULL, "
                  "ShowDir TEXT UNIQUE)")

      db.execute("CREATE TABLE FileName ("
                  "FileName TEXT UNIQUE NOT NULL, "
                  "ShowID INTEGER, "
                  "FOREIGN KEY (ShowID) REFERENCES ShowName(ShowID))")

      db.execute("CREATE TABLE SeasonDir ("
                  "ShowID INTEGER, "
                  "Season INTEGER NOT NULL, "
                  "SeasonDir TEXT NOT NULL, "
                  "FOREIGN KEY (ShowID) REFERENCES ShowName(ShowID),"
                  "CONSTRAINT SeasonDirPK PRIMARY KEY (ShowID,Season))")

      db.commit()

    goodlogging.Log.Info("DB", "Database initialisation complete", verbosity=self.logVerbosity)

  #################################################
  # _QueryDatabase
  #################################################
  def _QueryDatabase(self, query, tuples = None, commit = True, error = True):
    goodlogging.Log.Info("DB", "Database Query: {0} {1}".format(query, tuples), verbosity=self.logVerbosity)
    with sqlite3.connect(self._dbPath) as db:
      try:
        if tuples is None:
          result = db.execute(query)
        else:
          result = db.execute(query, tuples)
      except sqlite3.OperationalError:
        if error is True:
          raise
        return None
      else:
        if commit is True:
          db.commit()
        return result.fetchall()

  #################################################
  # _PurgeTable
  # Deletes all rows without dropping table
  #################################################
  def _PurgeTable(self, tableName):
    goodlogging.Log.Info("DB", "Deleting all entries from table {0}".format(tableName), verbosity=self.logVerbosity)
    self._QueryDatabase("DELETE FROM {0}".format(tableName))

  #################################################
  # GetConfigValue
  #################################################
  def GetConfigValue(self, fieldName):
    result = self._QueryDatabase("SELECT Value FROM Config WHERE Name=?", (fieldName, ))

    if result is None:
      return None
    elif len(result) == 0:
      return None
    elif len(result) == 1:
      goodlogging.Log.Info("DB", "Found database match in config table {0}={1}".format(fieldName, result[0][0]), verbosity=self.logVerbosity)
      return result[0][0]
    elif len(result) > 1:
      goodlogging.Log.Fatal("DB", "Database corrupted - multiple matches found in config table {0}={1}".format(fieldName, result))

  #################################################
  # SetConfigValue
  #################################################
  def SetConfigValue(self, fieldName, value):
    currentConfigValue = self.GetConfigValue(fieldName)

    if currentConfigValue is None:
      goodlogging.Log.Info("DB", "Adding {0}={1} to database config table".format(fieldName, value), verbosity=self.logVerbosity)
      self._QueryDatabase("INSERT INTO Config VALUES (?,?)", (fieldName, value))
    else:
      goodlogging.Log.Info("DB", "Updating {0} in database config table from {1} to {2}".format(fieldName, currentConfigValue, value), verbosity=self.logVerbosity)
      self._QueryDatabase("UPDATE Config SET Value=? WHERE Name=?", (value, fieldName))

  #################################################
  # _AddToSingleColumnTable
  #################################################
  def _AddToSingleColumnTable(self, tableName, columnHeading, newValue):
    match = None
    currentTable = self._GetFromSingleColumnTable(tableName)

    if currentTable is not None:
      for currentValue in currentTable:
        if currentValue == newValue:
          match = True

    if match is None:
      goodlogging.Log.Info("DB", "Adding {0} to {1} table".format(newValue, tableName), verbosity=self.logVerbosity)
      self._QueryDatabase("INSERT INTO {0} VALUES (?)".format(tableName), (newValue, ))
    else:
      goodlogging.Log.Info("DB", "{0} already exists in {1} table".format(newValue, tableName), verbosity=self.logVerbosity)

  #################################################
  # _GetFromSingleColumnTable
  #################################################
  def _GetFromSingleColumnTable(self, tableName):
    table = self._QueryDatabase("SELECT * FROM {0}".format(tableName), error = False)
    if table is None:
      return None
    elif len(table) == 0:
      return None
    elif len(table) > 0:
      tableList = [i[0] for i in table]
      return tableList

  #################################################
  # AddSupportedFormat
  #################################################
  def AddSupportedFormat(self, fileFormat):
    newFileFormat = fileFormat.lower()
    self._AddToSingleColumnTable("SupportedFormat", "FileFormat", newFileFormat)

  #################################################
  # GetSupportedFormats
  #################################################
  def GetSupportedFormats(self):
    formatList = self._GetFromSingleColumnTable("SupportedFormat")
    return formatList

  #################################################
  # PurgeSupportedFormats
  #################################################
  def PurgeSupportedFormats(self):
    self._PurgeTable("SupportedFormat")

  #################################################
  # AddIgnoredDir
  #################################################
  def AddIgnoredDir(self, ignoredDir):
    self._AddToSingleColumnTable("IgnoredDir", "DirName", ignoredDir)

  #################################################
  # GetIgnoredDirs
  #################################################
  def GetIgnoredDirs(self):
    dirList = self._GetFromSingleColumnTable("IgnoredDir")
    return dirList

  #################################################
  # PurgeIgnoredDirs
  #################################################
  def PurgeIgnoredDirs(self):
    self._PurgeTable("IgnoredDir")

  #################################################
  # AddShowToTVLibrary
  #################################################
  def AddShowToTVLibrary(self, showName):
    goodlogging.Log.Info("DB", "Adding {0} to TV library".format(showName), verbosity=self.logVerbosity)

    currentShowValues = self.SearchTVLibrary(showName = showName)

    if currentShowValues is None:
      self._QueryDatabase("INSERT INTO TVLibrary (ShowName) VALUES (?)", (showName, ))
      showID = self._QueryDatabase("SELECT (ShowID) FROM TVLibrary WHERE ShowName=?", (showName, ))[0][0]
      return showID
    else:
      goodlogging.Log.Fatal("DB", "An entry for {0} already exists in the TV library".format(showName))

  #################################################
  # UpdateShowDirInTVLibrary
  #################################################
  def UpdateShowDirInTVLibrary(self, showID, showDir):
    goodlogging.Log.Info("DB", "Updating TV library for ShowID={0}: ShowDir={1}".format(showID, showDir))
    self._QueryDatabase("UPDATE TVLibrary SET ShowDir=? WHERE ShowID=?", (showDir, showID))

  #################################################
  # SearchTVLibrary
  #################################################
  def SearchTVLibrary(self, showName = None, showID = None, showDir = None):
    unique = True
    if showName is None and showID is None and showDir is None:
      goodlogging.Log.Info("DB", "Looking up all items in TV library", verbosity=self.logVerbosity)
      queryString = "SELECT * FROM TVLibrary"
      queryTuple = None
      unique = False
    elif showDir is not None:
      goodlogging.Log.Info("DB", "Looking up from TV library where ShowDir is {0}".format(showDir), verbosity=self.logVerbosity)
      queryString = "SELECT * FROM TVLibrary WHERE ShowDir=?"
      queryTuple = (showDir, )
    elif showID is not None:
      goodlogging.Log.Info("DB", "Looking up from TV library where ShowID is {0}".format(showID), verbosity=self.logVerbosity)
      queryString = "SELECT * FROM TVLibrary WHERE ShowID=?"
      queryTuple = (showID, )
    elif showName is not None:
      goodlogging.Log.Info("DB", "Looking up from TV library where ShowName is {0}".format(showName), verbosity=self.logVerbosity)
      queryString = "SELECT * FROM TVLibrary WHERE ShowName=?"
      queryTuple = (showName, )

    result = self._QueryDatabase(queryString, queryTuple, error = False)

    if result is None:
      return None
    elif len(result) == 0:
      return None
    elif len(result) == 1:
      goodlogging.Log.Info("DB", "Found match in TVLibrary: {0}".format(result), verbosity=self.logVerbosity)
      return result
    elif len(result) > 1:
      if unique is True:
        goodlogging.Log.Fatal("DB", "Database corrupted - multiple matches found in TV Library: {0}".format(result))
      else:
        goodlogging.Log.Info("DB", "Found multiple matches in TVLibrary: {0}".format(result), verbosity=self.logVerbosity)
        return result

  #################################################
  # SearchFileNameTable
  #################################################
  def SearchFileNameTable(self, fileName):
    goodlogging.Log.Info("DB", "Looking up filename string '{0}' in database".format(fileName), verbosity=self.logVerbosity)

    queryString = "SELECT ShowID FROM FileName WHERE FileName=?"
    queryTuple = (fileName, )

    result = self._QueryDatabase(queryString, queryTuple, error = False)

    if result is None:
      goodlogging.Log.Info("DB", "No match found in database for '{0}'".format(fileName), verbosity=self.logVerbosity)
      return None
    elif len(result) == 0:
      return None
    elif len(result) == 1:
      goodlogging.Log.Info("DB", "Found file name match: {0}".format(result), verbosity=self.logVerbosity)
      return result[0][0]
    elif len(result) > 1:
      goodlogging.Log.Fatal("DB", "Database corrupted - multiple matches found in database table for: {0}".format(result))

  #################################################
  # AddFileNameTable
  #################################################
  def AddToFileNameTable(self, fileName, showID):
    goodlogging.Log.Info("DB", "Adding filename string match '{0}'={1} to database".format(fileName, showID), verbosity=self.logVerbosity)

    currentValues = self.SearchFileNameTable(fileName)

    if currentValues is None:
      self._QueryDatabase("INSERT INTO FileName (FileName, ShowID) VALUES (?,?)", (fileName, showID))
    else:
      goodlogging.Log.Fatal("DB", "An entry for '{0}' already exists in the FileName table".format(fileName))

  #################################################
  # SearchSeasonDirTable
  #################################################
  def SearchSeasonDirTable(self, showID, seasonNum):
    goodlogging.Log.Info("DB", "Looking up directory for ShowID={0} Season={1} in database".format(showID, seasonNum), verbosity=self.logVerbosity)

    queryString = "SELECT SeasonDir FROM SeasonDir WHERE ShowID=? AND Season=?"
    queryTuple = (showID, seasonNum)

    result = self._QueryDatabase(queryString, queryTuple, error = False)

    if result is None:
      goodlogging.Log.Info("DB", "No match found in database", verbosity=self.logVerbosity)
      return None
    elif len(result) == 0:
      return None
    elif len(result) == 1:
      goodlogging.Log.Info("DB", "Found database match: {0}".format(result), verbosity=self.logVerbosity)
      return result[0][0]
    elif len(result) > 1:
      goodlogging.Log.Fatal("DB", "Database corrupted - multiple matches found in database table for: {0}".format(result))

  #################################################
  # AddSeasonDirTable
  #################################################
  def AddSeasonDirTable(self, showID, seasonNum, seasonDir):
    goodlogging.Log.Info("DB", "Adding season directory ({0}) to database for ShowID={1}, Season={2}".format(seasonDir, showID, seasonNum), verbosity=self.logVerbosity)

    currentValue = self.SearchSeasonDirTable(showID, seasonNum)

    if currentValue is None:
      self._QueryDatabase("INSERT INTO SeasonDir (ShowID, Season, SeasonDir) VALUES (?,?,?)", (showID, seasonNum, seasonDir))
    else:
      if currentValue == seasonDir:
        goodlogging.Log.Info("DB", "A matching entry already exists in the SeasonDir table", verbosity=self.logVerbosity)
      else:
        goodlogging.Log.Fatal("DB", "A different entry already exists in the SeasonDir table")

  #################################################
  # _PrintDatabaseTable
  # Gets database column headings using PRAGMA call
  # Automatically adjusts each column width based on the
  # longest element that needs to be printed
  # Provide an optional list of column names and values to
  # print a subset of the table
  #################################################
  def _PrintDatabaseTable(self, tableName, rowSelect = None):
    goodlogging.Log.Info("DB", "{0}".format(tableName))
    goodlogging.Log.IncreaseIndent()
    tableInfo = self._QueryDatabase("PRAGMA table_info({0})".format(tableName))


    dbQuery = "SELECT * FROM {0}".format(tableName)
    dbQueryParams = []

    if rowSelect is not None:
      dbQuery = dbQuery + " WHERE " + ' AND '.join(['{0}=?'.format(i) for i, j in rowSelect])
      dbQueryParams = [j for i, j in rowSelect]

    tableData = self._QueryDatabase(dbQuery, dbQueryParams)
    columnCount = len(tableInfo)

    columnWidths = [0]*columnCount

    columnHeadings = []
    for count, column in enumerate(tableInfo):
      columnHeadings.append(column[1])
      columnWidths[count] = len(column[1])

    for row in tableData:
      for count, column in enumerate(row):
        if len(str(column)) > columnWidths[count]:
          columnWidths[count] = len(column)

    printStr = "|"
    for count, column in enumerate(columnWidths):
      printStr = printStr + " {{0[{0}]:{1}}} |".format(count, columnWidths[count])

    goodlogging.Log.Info("DB", printStr.format(columnHeadings))
    goodlogging.Log.Info("DB", "-"*(sum(columnWidths)+3*len(columnWidths)+1))

    for row in tableData:
      noneReplacedRow = ['-' if i is None else i for i in row]
      goodlogging.Log.Info("DB", printStr.format(noneReplacedRow))

    goodlogging.Log.DecreaseIndent()
    goodlogging.Log.NewLine()

    return len(tableData)

  #################################################
  # PrintAllTables
  #################################################
  def PrintAllTables(self):
    goodlogging.Log.Info("DB", "Database contents:\n")
    for table in self._tableDict.keys():
      self._PrintDatabaseTable(table)

  #################################################
  # _UpdateDatabaseFromResponse
  #################################################
  def _UpdateDatabaseFromResponse(self, response, mode):
    # Get tableName from user input (form TABLENAME COL1=VAL1 COL2=VAL2 etc)
    try:
      tableName, tableColumns = response.split(' ', 1)
    except ValueError:
      goodlogging.Log.Info("DB", "Database update failed - failed to extract table name from response")
      return None

    # Check user input against known table list
    if tableName not in self._tableDict.keys():
      goodlogging.Log.Info("DB", "Database update failed - unkown table name: {0}".format(tableName))
      return None

    # Build re pattern to extract column from user input (form TABLENAME COL1=VAL1 COL2=VAL2 etc)
    rowSelect = []
    for column in self._tableDict[tableName]:
      colPatternList = ['(?:{0})'.format(i) for i in self._tableDict[tableName] if i != column]
      colPatternList.append('(?:$)')
      colPatternMatch = '|'.join(colPatternList)
      matchPattern = '{0}.*?{1}=(.+?)\s*(?:{2})'.format(tableName, column, colPatternMatch)

      match = re.findall(matchPattern, response)

      # Match should be in form [(VAL1, VAL2, VAL3, etc.)]
      if len(match) == 1:
        rowSelect.append((column, match[0]))
      elif len(match) > 1:
        goodlogging.Log.Info('DB', 'Database update failed - multiple matches found for table {0} column {1}'.format(tableName, column))
        return None

    if len(rowSelect) == 0:
      goodlogging.Log.Info('DB', 'Database update failed - no row selection critera found in response')
      return None

    # Print selected rows
    rowCount = self._PrintDatabaseTable(tableName, rowSelect)

    # Do DELETE flow
    if mode.upper() == 'DEL':
      if rowCount == 0:
        goodlogging.Log.Info("DB", "Database update failed - no rows found for given search critera: {0}".format(response))
        return None

      deleteConfirmation = goodlogging.Log.Input("DB", "***WARNING*** DELETE THESE ROWS FROM {0} TABLE? [y/n]: ".format(tableName))
      deleteConfirmation = util.ValidUserResponse(deleteConfirmation, ('y', 'n'))

      if deleteConfirmation.lower() == 'n':
        goodlogging.Log.Info("DB", "Database table row delete cancelled")
        return None

      # Build delete database query (form DELETE FROM TableName WHERE COL1=?, COL2=?)
      dbQuery = "DELETE FROM {0}".format(tableName) \
                  + " WHERE " \
                  + ' AND '.join(['{0}=?'.format(i) for i, j in rowSelect])
      dbQueryParams = [j for i, j in rowSelect]

      self._QueryDatabase(dbQuery, dbQueryParams)

      goodlogging.Log.Info("DB", "Deleted {0} row(s) from database table {0}:".format(rowCount, tableName))

    # Do ADD flow
    elif mode.upper() == 'ADD':
      if rowCount != 0:
        goodlogging.Log.Info("DB", "Database update failed - a row already exists for the given critera: {0}".format(response))
        return None

      # Build insert database query (form INSERT INTO TableName (COL1, COL2) VALUES (?,?))
      dbQuery = "INSERT INTO {0} (".format(tableName) \
                  + ', '.join(['{0}'.format(i) for i, j in rowSelect]) \
                  + ") VALUES (" \
                  + ', '.join(['?']*len(rowSelect)) \
                  + ")"
      dbQueryParams = [j for i, j in rowSelect]

      self._QueryDatabase(dbQuery, dbQueryParams)

      goodlogging.Log.Info("DB", "Added row to database table {0}:".format(tableName))

    # Print resulting database table
    self._PrintDatabaseTable(tableName)

  #################################################
  # ManualUpdateTables
  #################################################
  def ManualUpdateTables(self):
    goodlogging.Log.Info("DB", "Starting manual database update:\n")
    updateFinished = False

    # Loop until the user continues program flow or exits
    while not updateFinished:
      prompt = "Enter 'ls' to print the database contents, " \
                     "'a' to add a table entry, " \
                     "'d' to delete a single table row, " \
                     "'p' to select a entire table to purge, " \
                     "'f' to finish or " \
                     "'x' to exit: "
      response = goodlogging.Log.Input("DM", prompt)

      goodlogging.Log.NewLine()
      goodlogging.Log.IncreaseIndent()

      # Exit program
      if response.lower() == 'x':
        goodlogging.Log.Fatal("DB", "Program exited by user response")

      # Finish updating database
      elif response.lower() == 'f':
        updateFinished = True

      # Print database tables
      elif response.lower() == 'ls':
        self.PrintAllTables()

      # Purge a given table
      elif response.lower() == 'p':
        response = goodlogging.Log.Input("DM", "Enter database table to purge or 'c' to cancel: ")

        # Go back to main update selection
        if response.lower() == 'c':
          goodlogging.Log.Info("DB", "Database table purge cancelled")

        # Purge table
        else:
          if response in self._tableDict.keys():
            self._PrintDatabaseTable(response)

            deleteConfirmation = goodlogging.Log.Input("DB", "***WARNING*** DELETE ALL ROWS FROM {0} TABLE? [y/n]: ".format(response))
            deleteConfirmation = util.ValidUserResponse(deleteConfirmation, ('y', 'n'))

            if deleteConfirmation.lower() == 'n':
              goodlogging.Log.Info("DB", "Database table purge cancelled")
            else:
              self._PurgeTable(response)
              goodlogging.Log.Info("DB", "{0} database table purged".format(response))
          else:
            goodlogging.Log.Info("DB", "Unknown table name ({0}) given to purge".format(response))

      # Add new row to table
      elif response.lower() == 'a':
        addFinished = False
        while not addFinished:
          prompt = "Enter new database row (in format TABLE COL1=VAL COL2=VAL etc) " \
                    "or 'c' to cancel: "
          response = goodlogging.Log.Input("DM", prompt)

          # Go back to main update selection
          if response.lower() == 'c':
            goodlogging.Log.Info("DB", "Database table add cancelled")
            addFinished = True

          # Add row to table
          else:
            self._UpdateDatabaseFromResponse(response, 'ADD')

      # Delete row(s) from table
      elif response.lower() == 'd':
        deleteFinished = False
        while not deleteFinished:
          prompt = "Enter database row to delete (in format TABLE COL1=VAL COL2=VAL etc) " \
                    "or 'c' to cancel: "
          response = goodlogging.Log.Input("DM", prompt)

          # Go back to main update selection
          if response.lower() == 'c':
            goodlogging.Log.Info("DB", "Database table row delete cancelled")
            deleteFinished = True

          # Delete row(s) from table
          else:
            self._UpdateDatabaseFromResponse(response, 'DEL')

      # Unknown user input given
      else:
        goodlogging.Log.Info("DB", "Unknown response")

      goodlogging.Log.DecreaseIndent()
      goodlogging.Log.NewLine()

    goodlogging.Log.Info("DB", "Manual database update complete.")
    self.PrintAllTables()
