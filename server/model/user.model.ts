import { Role } from 'config/config';
import { Document, model, Schema, SchemaTypes } from 'mongoose';
const collectionName = 'User';

const roles = Object.keys(Role);

const schema = new Schema({
    name: { type: String, required: true, cn: '名称' },
    account: { type: String, required: true, unique: true, cn: '账号' },
    role: { type: String, enum: roles, cn: '角色' },
    groups: [{ type: SchemaTypes.ObjectId, ref: 'Group', cn: '阿米巴组' }],
    available: { type: Boolean, default: true, cn: '状态' },
    extranet: { type: Boolean, default: true, cn: '外网权限' },
    removed: { type: Boolean, default: false },
    password: { type: String, default: '111111' },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const UserModel = model<amb.IUser & Document>(collectionName, schema);

export {
    UserModel,
    roles,
};
