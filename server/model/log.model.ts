import { model, Schema } from 'mongoose';
const collectionName = 'Log';

const schema = new Schema({}, { strict: false, capped: { max: 10000, size: 1024 * 1024 * 5 } });
const LogoModel = model(collectionName, schema);

const logConf = {
    async transport(data: any) {
        if (data.title === 'info') { console.log(`${data.file}:${data.line} (${data.method}) ${data.message}`); }
        await new LogoModel(data).save().catch(console.log);
        console.log(`${data.file}:${data.line} (${data.method}) ${data.message}`);
    },
};

type fn = (title: string, obj: any) => void;
const tracer = require('tracer').console(logConf);
export default tracer as {
    log: fn,
    trace: fn,
    debug: fn,
    info: fn,
    warn: fn,
    error: fn,
};
