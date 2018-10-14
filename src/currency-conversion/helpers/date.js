const _parsed = number => (number >= 10 ? number : `0${number}`);


const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = _parsed(date.getMonth() + 1);
  const day = _parsed(date.getDate());
  return `${year}-${month}-${day}`;
};


module.exports = getToday;
