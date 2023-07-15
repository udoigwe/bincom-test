//accessing & configuring environmental variables
const dotenv = require('dotenv');
dotenv.config();
//Accepting from unauthorized
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

//variables
const express = require('express');
const app = express();
const port = process.env.PORT || 8705;
const cors = require('cors');

//using middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

//importing all required routes
const generalRoutes = require('./src/routes/general');
/*const userRoutes = require('./src/routes/user');
const mediaEventCategoryRoutes = require('./src/routes/mediaEventCategory');
const mediaEventRoutes = require('./src/routes/mediaEvent');
const mediaRoutes = require('./src/routes/media');
const messageRoutes = require('./src/routes/message');
const newsRoutes = require('./src/routes/news');
const cartRoutes = require('./src/routes/cart');
const ratingRoutes = require('./src/routes/rating');
const orderRoutes = require('./src/routes/order');
*/

//using imported routes
app.use(process.env.ROUTE_PREFIX, generalRoutes);
/*app.use(process.env.ROUTE_PREFIX, userRoutes);
app.use(process.env.ROUTE_PREFIX, mediaEventCategoryRoutes);
app.use(process.env.ROUTE_PREFIX, mediaEventRoutes);
app.use(process.env.ROUTE_PREFIX, mediaRoutes);
app.use(process.env.ROUTE_PREFIX, messageRoutes);
app.use(process.env.ROUTE_PREFIX, newsRoutes);
app.use(process.env.ROUTE_PREFIX, cartRoutes);
app.use(process.env.ROUTE_PREFIX, ratingRoutes);
app.use(process.env.ROUTE_PREFIX, orderRoutes); */

app.listen(port, () => {
    console.log(`App successfully running on port ${port}`);
})