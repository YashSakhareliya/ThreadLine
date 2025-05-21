const express = require('express');
const fabricRouter = require('./routes/fabricRouter');
const cartRoutes = require('./routes/cartRouter'); // Path to the cartRoutes file
const orderRouter = require('./routes/orderRouter');
const sellerRouter = require('./routes/sellerRouter');
const tailorRouter = require('./routes/tailorRouter');
const authenication=require('./routes/userRoute')
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();
const database=require("./config/database")
var cors = require('cors')
const fileUpload = require("express-fileupload");
const protect = require('./middleware/authMiddleware');
const {cloudinaryConnect}=require("./config/cloudinary")

const PORT = process.env.PORT || 4000;

database.connect();
 
// Middlewares
app.use(express.json());

app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);
app.use(cookieParser());

cloudinaryConnect();

app.use('/api/auth',authenication)
app.use('/api/tailors', tailorRouter); 
app.use('/api/cart', cartRoutes);
app.use('/api/sellers', sellerRouter);
app.use('/api/fabrics', protect, fabricRouter);
app.use('/api/orders', orderRouter);

app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});