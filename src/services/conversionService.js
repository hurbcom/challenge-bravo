module.exports = { convert }

async function convert(from, to, amount) {
  try {
    return 'ok';
  } catch (error) {
    res.status(500).send(error);
  }
}
