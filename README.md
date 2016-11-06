[![](https://img.shields.io/npm/dt/jsonp-es6.svg)](https://www.npmjs.com/package/jsonp-es6)

# JSONP with promises

This tiny library is based on Lightweight JSONP: https://github.com/erikarenhill/Lightweight-JSONP and allows to use promises along with JSONP requests.

Usage:

```javascript
  var jsonp = require('jsonp-promise'),
      url = 'http://example.com',
      params = {
        param1: 'param1',
        param2: 'param2'
      };
  
  jsonp(url, params)
    .then((result) => {
      // something useful
    });
```
