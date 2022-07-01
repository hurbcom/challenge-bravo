exports.convert = function() {
  try {
    return 'ok';
  } catch (error) {
    res.status(500).send(error);
  }
}