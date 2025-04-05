import { model, Schema } from "mongoose";
import { ITable } from "./table.interface";



const tableSchema = new Schema<ITable>(
  {
    name: {
      type: String,
      required: true,
      trim: true
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