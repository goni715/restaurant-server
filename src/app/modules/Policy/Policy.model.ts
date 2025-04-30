import { Schema, model } from 'mongoose';
import { IPolicy } from './Policy.interface';
import { PolicyTypeArray } from './Policy.constant';
      
const policySchema = new Schema<IPolicy>({
  type: {
    type: String,
    enum: PolicyTypeArray,
    required: true,
    unique: true,
  },
  content: { 
    type: String,
    required: true,
    trim: true
  }
}, {
    timestamps: true,
    versionKey: false
})
      
const PolicyModel = model<IPolicy>('Policy', policySchema);
export default PolicyModel;
      