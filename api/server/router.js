const glob = require('glob');


module.exports = () => {
        const cwd = process.cwd();

        const files = glob.sync("./api/modules/**/route.js");

        files.forEach((rout) => {
            const path = cwd + rout.substring(1, rout.length);
            require(path);
        });
    }

