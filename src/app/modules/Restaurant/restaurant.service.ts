import { IRestaurantPayload } from "./restaurant.interface";



const createRestaurantService = async (payload: IRestaurantPayload) => {
    return payload;
}


export {
    createRestaurantService
}