module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteById
}

async function getAll (){
  res.send('getAll');
}

async function getById (){
  res.send('getById');
}

async function create (){
  res.send('create');
}

async function update (){
  res.send('update');
}

async function deleteById (){
  res.send('delete');
}
