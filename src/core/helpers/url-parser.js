const {
  compose, curry, join, replace,
} = require('ramda');


const _formatTo = curry((to, url) => {
  const toJoined = join(',', to);
  return replace('{{to}}', toJoined, url);
});

const _formatFrom = curry((from, url) => replace('{{from}}', from, url));

const _transform = (from = '', to = []) => {
  const _formatToCurried = _formatTo(to);
  const _formatFromCurried = _formatFrom(from);
  return compose(_formatToCurried, _formatFromCurried);
};

const parse = ({ url, from, to }) => _transform(from, to)(url);


module.exports = parse;
