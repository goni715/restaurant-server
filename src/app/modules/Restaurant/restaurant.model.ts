import { model, Schema } from "mongoose";
import { IRestaurant } from "./restaurant.interface";


const restaurantSchema = new Schema<IRestaurant>({
    ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    dining: [{
        type: Schema.Types.ObjectId,
        ref: "Dining",
        required: true,
    }],
    location: {
        type: String,
        required:true,
        trim: true
    },
    keywords: {
        type: [String],
        default: []
    },
    features: {
        type: [String],
        default: []
    },
    discount: {
        type: String,
        trim: true
    },
    ratings: {
        type: Number,
        trim: true,
        default: 0,
    },
    restaurantImg: { 
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ["active", "deactive"],
        default: 'active'
    },
    approved: {
        type: String,
        enum: ["pending", "accepted", "cancelled"],
        default: 'pending'
    }
},{
    timestamps: true,
    versionKey: false
})


const RestaurantModel = model<IRestaurant>('Restaurant', restaurantSchema);
export default RestaurantModel;