const http = require('http');
const port = process.env.npm_package_config_port || 80;

console.log('LISTENING ON PORT ' + port);

http.createServer(function (req, res) {
    var body = '';

    req.on('data', function (data) {
        body += data;

        if (body.length > Math.pow(10, 6)) {
            req.connection.destroy();
        }
    });

    req.on('end', function () {
        console.log('----------[REQUEST]-----------');

        console.info('METHOD: ' + req.method);

        let type = '';

        if (typeof req.headers['content-type'] !== 'undefined') {
            type = req.headers['content-type']
            delete req.headers['content-type'];
            console.info('CONTENT-TYPE: ' + type);
        }

        if (typeof req.headers.cookie !== 'undefined') {
            let cookie = req.headers.cookie.split(';');
            delete req.headers.cookie;
            console.info('COOKIE:');
            console.table(cookie);
        }

        if (typeof req.headers.accept !== 'undefined') {
            let accept = req.headers.accept.split(',');
            delete req.headers.accept;
            console.info('ACCEPT:');
            console.table(accept);
        }

        console.info('HEADERS:');
        console.table(req.headers);

        console.info('URL: ' + req.url);

        let query = req.url.split('?', 2);
        if (query.length > 1) {
            console.info('QUERY');
            console.table(splitQueryString(query[1]));
        }

        if (body.length > 0) {
            console.info('BODY:');

            switch (type) {
                case 'application/x-www-form-urlencoded':
                    console.table(splitQueryString(body));
                    break;
                default:
                    console.table(body);
                    break;
            }
        }

        console.log('-------------------------------');
    });

    res.end();
}).listen(port);

function splitQueryString(query) {
    let res = {};

    query.split('&').forEach((item) => {
        let elements = item.split('=', 2);

        if (elements.length > 0) {
            if (elements.length > 1) {
                res[elements[0]] = elements[1];
            } else {
                res[elements[0]] = elements[1];
            }
        }
    });

    return res;
}