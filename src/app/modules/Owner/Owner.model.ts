import { Schema, model } from 'mongoose';
import { IOwner } from './Owner.interface';
      
const ownerSchema = new Schema<IOwner>({
  name: { 
    type: String,
    required: true
  },
  description: { 
    type: String
  }
}, {
    timestamps: true,
    versionKey: false
})
      
const OwnerModel = model<IOwner>('Owner', ownerSchema);
export default OwnerModel;
      