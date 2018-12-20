/* eslint-disable prefer-template */
/* eslint-disable no-nested-ternary */
import fs from 'fs';

const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};


const log = (type, fileName, describe) => {

    const level = (type === 1) ? 'info'
        : (type === 2) ? 'warn'
            : 'error';

    const logFile = `log/log-${formatDate(new Date())}.txt`;

    fs.appendFile(logFile, `${level} - ${new Date()} - ${fileName}:  ${describe} \n`, 'utf8', (err) => {
        if (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    });
};

export { log as default };
