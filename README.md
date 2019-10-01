# dva-subscriber
DVA Subscription module to help handle path changes and query

## Install
```
$ yarn add dva-subscriber
```

## Usage

```javascript
import { subscribe } from 'dva-subscriber';

export default {
  namespace: 'namespace',
  state: {},
  subscriptions: subscribe('/custom-path', {
    '': (params, query) => [{ type: 'query', payload: query }],
    '/new': () => [{ type: 'updateState', payload: { entity: {} } }],
    '/edit/:uuid': ({ uuid }) => [{ type: 'findOne', payload: uuid }],
  }),
  effects: {},
  reducers: {},
};
```