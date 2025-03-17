import { model, Schema } from "mongoose";
import { IFavourite } from "./favourite.interface";

const favouriteSchema = new Schema<IFavourite>({
  userId: { type: Schema.Types.ObjectId, required:true, ref: "User"},
  restaurantId: {type: Schema.Types.ObjectId, required: true, ref:"Restaurant"}
},{
  timestamps: true,
  versionKey: false
}
);


const FavouriteModel = model<IFavourite>("Favourite", favouriteSchema);
export default FavouriteModel;