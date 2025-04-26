import { model, Schema } from "mongoose";
import { ITable } from "./table.interface";



const tableSchema = new Schema<ITable>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(v) {
          const regex = /^T-[1-9]\d*$/;
          return regex.test(v);
        },
        message: props => `${props.value} is not a valid table Name! Name must be in the format 'T-1', 'T-2', ... (no T-0 or T-01)`
      }
    },
    slug: {
      type: String,
      required: true,
      trim: true
    },
    scheduleId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Schedule"
    },
    diningId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Dining"
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    seats: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value > 0; // Ensures the number is positive
        },
        message: "seats must be a positive number",
      },
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TableModel = model<ITable>('Table', tableSchema);
export default TableModel;