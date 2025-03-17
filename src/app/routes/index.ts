import express from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { RestaurantRoutes } from '../modules/Restaurant/restaurant.route';
import { FavouriteRoutes } from '../modules/Favourite/favourite.route';
import { ReviewRoutes } from '../modules/Review/review.route';

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
]

moduleRoutes.forEach((item, i)=> router.use(item.path, item.route));

export default router;