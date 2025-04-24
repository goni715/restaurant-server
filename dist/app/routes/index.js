"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const restaurant_route_1 = require("../modules/Restaurant/restaurant.route");
const favourite_route_1 = require("../modules/Favourite/favourite.route");
const review_route_1 = require("../modules/Review/review.route");
const notification_route_1 = require("../modules/Notification/notification.route");
const cuisine_route_1 = require("../modules/Cuisine/cuisine.route");
const dining_route_1 = require("../modules/Dining/dining.route");
const socialMedia_route_1 = require("../modules/SocialMedia/socialMedia.route");
const menu_route_1 = require("../modules/Menu/menu.route");
const menuReview_route_1 = require("../modules/MenuReview/menuReview.route");
const schedule_route_1 = require("../modules/Schedule/schedule.route");
const booking_route_1 = require("../modules/Booking/booking.route");
const slot_route_1 = require("../modules/Slot/slot.route");
const administrator_route_1 = require("../modules/Administrator/administrator.route");
const table_route_1 = require("../modules/Table/table.route");
const tableBooking_route_1 = require("../modules/TableBooking/tableBooking.route");
const owner_route_1 = require("../modules/Owner/owner.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes
    },
    {
        path: '/user',
        route: user_route_1.UserRoutes
    },
    {
        path: '/owner',
        route: owner_route_1.OwnerRoutes
    },
    {
        path: '/cuisine',
        route: cuisine_route_1.CuisineRoutes
    },
    {
        path: '/dining',
        route: dining_route_1.DiningRoutes
    },
    {
        path: '/social-media',
        route: socialMedia_route_1.SocialMediaRoutes
    },
    {
        path: '/restaurant',
        route: restaurant_route_1.RestaurantRoutes
    },
    {
        path: '/menu',
        route: menu_route_1.MenuRoutes
    },
    {
        path: '/favourite',
        route: favourite_route_1.FavouriteRoutes
    },
    {
        path: '/review',
        route: review_route_1.ReviewRoutes
    },
    {
        path: '/menu-review',
        route: menuReview_route_1.MenuReviewRoutes
    },
    {
        path: '/notification',
        route: notification_route_1.NotificationRoutes
    },
    {
        path: '/schedule',
        route: schedule_route_1.ScheduleRoutes
    },
    {
        path: '/booking',
        route: booking_route_1.BookingRoutes
    },
    {
        path: '/slot',
        route: slot_route_1.SlotRoutes
    },
    {
        path: '/administrator',
        route: administrator_route_1.AdministratorRoutes
    },
    {
        path: '/table',
        route: table_route_1.TableRoutes
    },
    {
        path: '/table-booking',
        route: tableBooking_route_1.TableBookingRoutes
    }
];
moduleRoutes.forEach((item, i) => router.use(item.path, item.route));
exports.default = router;
