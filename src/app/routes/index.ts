import express from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { RestaurantRoutes } from '../modules/Restaurant/restaurant.route';
import { FavouriteRoutes } from '../modules/Favourite/favourite.route';
import { ReviewRoutes } from '../modules/Review/review.route';
import { NotificationRoutes } from '../modules/Notification/notification.route';
import { CuisineRoutes } from '../modules/Cuisine/cuisine.route';

const router = express.Router();


const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/user',
        route: UserRoutes
    },  
    {
        path: '/admin',
        route: AdminRoutes
    }, 
    {
        path: '/cuisine',
        route: CuisineRoutes
    },
    {
        path: '/restaurant',
        route: RestaurantRoutes
    },
    {
        path: '/favourite',
        route: FavouriteRoutes
    },
    {
        path: '/review',
        route: ReviewRoutes
    },  
    {
        path: '/notification',
        route: NotificationRoutes
    }  
]

moduleRoutes.forEach((item, i)=> router.use(item.path, item.route));

export default router;