const express = require("express");
const paymentController = require("../controllers/payment/paymentController");

const router = express.Router();

router.route("/create-payment").post(paymentController.createPayment);

router.route("/:id").get(paymentController.getPaymentById);

router.post("/webhook", paymentController.cashfreeWebhook);

router.route("/verify").post(paymentController.verifyPayment);

module.exports = router;
