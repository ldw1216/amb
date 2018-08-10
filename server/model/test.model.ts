import { Document, model, Schema, SchemaTypes } from 'mongoose';
const collectionName = 'Test';

const schema = new Schema({}, { strict: false, capped: { max: 10000, size: 1024 * 1024 * 5 } });

const Model = model<Document>(collectionName, schema);
