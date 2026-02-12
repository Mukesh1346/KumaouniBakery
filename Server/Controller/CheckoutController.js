const Razorpay = require('razorpay');
const crypto = require('crypto');
const Checkout = require('../Model/CheckoutModel');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY || "rzp_test_XPcfzOlm39oYi8",
    key_secret: process.env.RAZORPAY_API_SECRET || "Q79P6w7erUar31TwW4GLAkpa",
});

// const createCheckout = async (req, res) => {
//     try {
//         console.log("FORMDATA=>", req.body)
//         const { userId, name, email, phone, address, state, city, pin, cartItems, totalPrice, paymentMode } = req.body;

//         if (!userId || !name || !email || !phone || !address || !state || !city || !pin || !Array.isArray(cartItems) || cartItems.length === 0 || totalPrice <= 0) {
//             return res.status(400).json({ message: "All fields are required and must be valid." });
//         }

//         // Ensure totalPrice has only two decimal places
//         const formattedTotalPrice = Number(totalPrice.toFixed(2));

//         if (paymentMode === "cod") {
//             const newCheckout = new Checkout({
//                 userId, name, email, phone, address, state, city, pin, cartItems, totalPrice: formattedTotalPrice,
//                 transactionId: null, orderStatus: 'Order Confirmed', paymentMode, paymentStatus: 'Pending',
//             });
//             const savedCheckout = await newCheckout.save();
//             return res.status(200).json(savedCheckout);
//         }

//         const options = {
//             amount: Math.round(totalPrice * 100), // Convert to paise
//             currency: 'INR',
//             receipt: `receipt_${Date.now()}`,
//         };

//         const order = await razorpay.orders.create(options);
//         if (!order) {
//             return res.status(500).json({ message: "Razorpay order creation failed." });
//         }
//         const newCheckout = new Checkout({
//             userId, name, email, phone, address, state, city, pin, cartItems, totalPrice: formattedTotalPrice,
//             transactionId: order.id, orderStatus: 'Order Confirmed', paymentMode, paymentStatus: 'Pending',
//         });
//         const savedCheckout = await newCheckout.save();

//         res.status(200).json({
//             message: 'Order created successfully. Proceed with payment.',
//             checkout: savedCheckout,
//             razorpayOrderId: order.id,
//             amount: options.amount,
//             currency: options.currency,
//         });
//     } catch (error) {
//         console.error("Checkout creation error:", error);
//         res.status(500).json({ message: "Server error occurred while creating checkout." });
//     }
// };

const createCheckout = async (req, res) => {
    try {
        console.log("FORMDATA =>", req.body);

        const {
            user,
            address,
            cart,
            delivery,
            totalAmount,
            paymentMode,
        } = req.body;

        // ✅ Basic validation
        if (
            !user?.userId ||
            !address?.receiverName ||
            !address?.phone ||
            !address?.house ||
            !address?.city ||
            !address?.pincode ||
            !Array.isArray(cart) ||
            cart.length === 0 ||
            totalAmount <= 0
        ) {
            return res.status(400).json({ message: "Invalid checkout data." });
        }

        // ✅ Format cart items for DB schema
        const formattedCartItems = cart.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            weight: item.weight || "",
            image: item.image?.replace(/\\/g, "/"),
            price: item.price,
            // deliveryDate: item.deliveryDate || "",
            addonProducts: item.addonProducts || [],
            massage: item?.massage || ""
        }));

        const fullAddress = `${address.house}, ${address.area}, ${address.city}, ${address.pincode}`;

        const formattedTotalPrice = Number(parseFloat(totalAmount).toFixed(2));

        /* ------------------ COD ORDER ------------------ */
        if (paymentMode?.toLowerCase() === "cod") {
            const trackingOrders = [{
                date: new Date().toDateString(),
                status: "Order Confirmed",
                massage: "Your order is out for delivery"
            }];

            const newCheckout = new Checkout({
                userId: user.userId,
                name: address.receiverName,
                email: user.email,
                phone: address.phone,
                address: fullAddress,
                state: address.state || "N/A",
                city: address.city,
                pin: address.pincode,
                trackingOrders: trackingOrders,
                delivery: { date: delivery.date, time: delivery.time },
                cartItems: formattedCartItems,
                totalPrice: formattedTotalPrice,
                transactionId: null,
                orderStatus: "Order Confirmed",
                paymentMode: "cod",
                paymentStatus: "Pending",
            });

            const savedCheckout = await newCheckout.save();
            return res.status(200).json(savedCheckout);
        }

        /* ------------------ ONLINE PAYMENT ------------------ */
        const options = {
            amount: Math.round(formattedTotalPrice * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ message: "Razorpay order creation failed." });
        }
        // console.log("ORDER =>", order)
        const trackingOrders = [{
            date: new Date().toDateString(),
            status: "Order Confirmed",
            massage: "Your order is out for delivery"
        }];

        const newCheckout = new Checkout({
            userId: user.userId,
            name: address.receiverName,
            email: user.email,
            phone: address.phone,
            address: fullAddress,
            state: address.state || "N/A",
            city: address.city,
            pin: address.pincode,
            cartItems: formattedCartItems,
            totalPrice: formattedTotalPrice,
            trackingOrders: trackingOrders,
            transactionId: order.id,
            orderStatus: "Order Created",
            paymentMode: "online",
            paymentStatus: "Pending",
        });
        console.log("SSSSS::=>", newCheckout)
        const savedCheckout = await newCheckout.save();

        res.status(200).json({
            message: "Order created. Proceed to payment.",
            checkout: savedCheckout,
            razorpayOrderId: order.id,
            amount: options.amount,
            currency: options.currency,
        });

    } catch (error) {
        console.error("Checkout creation error:", error);
        res.status(500).json({ message: "Server error while creating checkout." });
    }
};


const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signatur } = req.body;

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signatur) {
            return res.status(400).json({ message: "Payment verification failed. Missing parameters." });
        }
        console.log("DDDDDDDD===>", req.body)
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || "1xt3UXSTLfyVhQa3G9SSVIKY");
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature === razorpay_signatur) {
            const updatedCheckout = await Checkout.findOneAndUpdate(
                { transactionId: razorpay_order_id },
                { paymentStatus: 'Success', orderStatus: 'Order Confirmed' },
                { new: true }
            );
            if (!updatedCheckout) {
                return res.status(404).json({ message: "Order not found." });
            }
            return res.status(200).json({ message: 'Payment successful and order confirmed.', checkout: updatedCheckout });
        } else {
            return res.status(400).json({ message: 'Invalid signature, payment verification failed.' });
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ message: 'Server error during payment verification.' });
    }
};


const getAllCheckouts = async (req, res) => {
    try {
        const checkouts = await Checkout.find({});
        res.status(200).json(checkouts.reverse());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred while retrieving checkouts." });
    }
};

const getCheckoutById = async (req, res) => {
    try {
        const { id } = req.params;
        const checkout = await Checkout.findById(id);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found." });
        }
        res.status(200).json(checkout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred while retrieving checkout." });
    }
};

const deleteCheckout = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCheckout = await Checkout.findByIdAndDelete(id);
        if (!deletedCheckout) {
            return res.status(404).json({ message: "Checkout not found." });
        }
        res.status(200).json({ message: "Checkout deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred while deleting checkout." });
    }
};

const updateCheckoutStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus, paymentStatus, orderStatusMassage } = req.body;
        const updatedCheckout = await Checkout.findByIdAndUpdate(
            id,
            {
                orderStatus,
                paymentStatus,
                $push: {
                    trackingOrders: {
                        date: new Date(),
                        status: orderStatus,
                        massage: orderStatusMassage,
                    },
                },
            },  // Fields to update
            { new: true, runValidators: true } // Return updated document and run validators
        );
        if (!updatedCheckout) {
            return res.status(404).json({ message: "Checkout not found." });
        }
        res.status(200).json(updatedCheckout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred while updating checkout status." });
    }
};

const getCheckOutByUserID = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await Checkout.find({ userId });  // find based on userId, not findOne
        if (!data.length) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



module.exports = {
    createCheckout,
    getAllCheckouts,
    getCheckoutById,
    deleteCheckout,
    updateCheckoutStatus,
    getCheckOutByUserID,
    verifyPayment,
};
