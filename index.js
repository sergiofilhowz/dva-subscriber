const qs = require('query-string');
const _ = require('lodash');

function process(path) {
  const keys = [];
  const pathProcessed = path.replace(/(\/:([^/]*))/g, name => {
    keys.push(name.substring(2));
    return '/([^/]*)';
  });
  const regex = new RegExp(`^${pathProcessed}$`);
  return (location, query, handler) => {
    const result = regex.exec(location);
    if (result) {
      const parameters = {};
      _.forEach(keys, (key, index) => (parameters[key] = result[index + 1]));
      return handler(parameters, query);
    }
  };
}

const createSubscription = (path, cfg) => ({ history, dispatch }) => {
  const { '*': defaultHandler, ...config } = cfg;
  const actionCreators = [];
  const parentRegex = new RegExp(`^${path}/.*$`, 'i');
  const handleAction = actions => {
    actions && _.isArray(actions) ? actions.forEach(dispatch) : actions && dispatch(actions);
  };

  _.forEach(config, (handler, key) => {
    const regex = process(path + key);
    actionCreators.push((location, query) => regex(location, query, handler));
  });

  history.listen(location => {
    const { pathname, search } = location;
    const query = qs.parse(search);
    defaultHandler && parentRegex.exec(pathname) && handleAction(defaultHandler(query));
    actionCreators.forEach(actionCreator => handleAction(actionCreator(pathname, query)));
  });
};

const subscribe = (path, cfg) => ({ setup: createSubscription(path, cfg) });

module.exports = { createSubscription, subscribe };
