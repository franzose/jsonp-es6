;(function(module, window, undefined) {
    "use strict";

    var script,
        done,
        timer,
        counter = 0;

    /**
     * Generates unique callback name.
     *
     * @param {String} name
     * @returns {string}
     */
    function getUniqueCallbackName(name) {
        return name + '_json' + (++counter);
    }

    /**
     * Setups full URL with all parameters.
     *
     * @param {String} baseUrl
     * @param {Object} params
     * @param {String} callbackName
     * @param {String} callbackUnique
     * @returns {String}
     */
    function getQuery(baseUrl, params, callbackName, callbackUnique) {
        var query = (baseUrl || '').indexOf('?') === -1 ? '?' : '&';

        params = params || {};

        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
            }
        }

        return baseUrl + query + callbackName + '=' + callbackUnique;
    }

    /**
     * Performs actual request.
     *
     * @param {String} url
     * @param {Function} errorCallback
     */
    function load(url, errorCallback) {
        script = document.createElement('script');
        script.src = url;
        script.async = true;

        var errorHandler = errorCallback || config.error;

        if (typeof errorHandler === 'function') {
            script.onerror = errorHandler;
        }

        script.onload = script.onreadystatechange = function() {
            if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                done = true;
                script.onload = script.onreadystatechange = null;

                if (script && script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            }
        };

        document.getElementsByTagName('head')[0].appendChild(script);
    }

    module.exports = function(url, params, options){
        "use strict";

        options = options || {};
        options.timeout = options.timeout || 15000;

        var callbackName = options.callback || 'callback',
            callback = getUniqueCallbackName(callbackName);

        return new Promise(function(resolve, reject) {
            if (options.timeout) {
                timer = setTimeout(function() {
                    reject(new Error('JSONP request timed out.'));
                }, options.timeout);
            }

            window[callback] = function(data){
                try {
                    delete window[callback];
                } catch (e) {}

                window[callback] = null;

                clearTimeout(timer);

                resolve(data);
            };

            var query = getQuery(url, params, callbackName, callback),
                error = function() { reject(new Error('Script loading error.')) };

            load(query, error);
        });
    };
})(module, window);
