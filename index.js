var request = require('request');
var numeral = require('numeral');

var _lookup = () => {

    return {

        getRunescapeCommands: () => {
            return ['price'];
        },

        processRunescapeMessage: (author, commandLine, command, split, discordQueue, runescapeQueue) => {
            var item = commandLine.substring(6);
            request('https://runescape.wikia.com/wiki/' + item, (err, response, body) => {
                if (err) {
                    runescapeQueue.push([`Error looking up ${item}: ${err}`, undefined, new Date()]);
                    return;
                }
                var found = body.match(/(?<=data-val-each=")(.*?)(?=")/);
                if (!found) {
                    runescapeQueue.push([`Error looking up ${item}. Might not be tradeable.`, undefined, new Date()]);
                    return;
                }
                var price = found[0];
                found = body.match(/(?<=data-item=")(.*?)(?=")/);
                runescapeQueue.push([`Price found for ${found[0]}: ${numeral(price).format(0,0)}.`, undefined, new Date()]);
            });
        }

    };

};
module.exports = _lookup;