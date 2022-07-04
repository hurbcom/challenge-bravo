
module.exports = {
  convert
}

async function convert () {
  try {
    return 'ok';
  } catch (error) {
    res.status(500).send(error);
  }
}
