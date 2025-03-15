import { model, Schema } from "mongoose";
import { IRestaurant } from "./restaurant.interface";


const restaurantSchema = new Schema<IRestaurant>({
    ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    cuisine: {
        type: String,
        required:true,
        trim: true
    },
    website: {
        type: String,
        required:true,
        trim: true
    },
    location: {
        type: String,
        required:true,
        trim: true
    },
    keywords: {
        type: [String],
        default: []
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    features: {
        type: [String],
        default: []
    },
    cancellationCharge: {
        type: Number,
        required: true,
        trim: true
    },
    discount: {
        type: String,
        trim: true
    },
    availability: {
        type: String,
        enum: [ "Immediate seating", "Open reservations", "Waitlist"]
    },
    status: {
        type: String,
        enum: ["active", "deactive"],
        default: 'active'
    }
},{
    timestamps: true,
    versionKey: false
})


const RestaurantModel = model<IRestaurant>('Restaurant', restaurantSchema);
export default RestaurantModel;