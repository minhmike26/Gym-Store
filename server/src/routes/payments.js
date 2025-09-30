const { Router } = require("express");
const crypto = require("crypto");
const querystring = require("querystring");
const Order = require("../models/Order");

const router = Router();

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

router.post("/vnpay/create", async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const tmnCode = process.env.VNPAY_TMNCODE;
  const secretKey = process.env.VNPAY_HASHSECRET;
  const vnpUrl = process.env.VNPAY_URL;
  const returnUrl = process.env.VNPAY_RETURNURL;

  const createDate = new Date();
  const orderIdStr = String(order._id);
  const amount = Math.round(order.totalPrice * 100);

  const vnpParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderIdStr,
    vnp_OrderInfo: `Order ${orderIdStr}`,
    vnp_OrderType: "other",
    vnp_Amount: amount,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: req.ip || "127.0.0.1",
    vnp_CreateDate: `${createDate.getFullYear()}${String(
      createDate.getMonth() + 1
    ).padStart(2, "0")}${String(createDate.getDate()).padStart(2, "0")}${String(
      createDate.getHours()
    ).padStart(2, "0")}${String(createDate.getMinutes()).padStart(
      2,
      "0"
    )}${String(createDate.getSeconds()).padStart(2, "0")}`,
  };

  const sortedParams = sortObject(vnpParams);
  const signData = querystring.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  sortedParams.vnp_SecureHash = signed;
  const paymentUrl = `${vnpUrl}?${querystring.stringify(sortedParams, {
    encode: false,
  })}`;

  res.json({ url: paymentUrl });
});

router.get("/vnpay_return", async (req, res) => {
  const vnpParams = { ...req.query };
  const secureHash = vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHashType;

  const secretKey = process.env.VNPAY_HASHSECRET;
  const signData = querystring.stringify(sortObject(vnpParams), {
    encode: false,
  });
  const signedCheck = crypto
    .createHmac("sha512", secretKey)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  const orderId = vnpParams.vnp_TxnRef;
  const rspCode = vnpParams.vnp_ResponseCode;

  if (secureHash === signedCheck) {
    const paid = rspCode === "00";
    await Order.findByIdAndUpdate(orderId, {
      isPaid: paid,
      paidAt: paid ? new Date() : undefined,
      status: paid ? "paid" : "pending",
      paymentResult: {
        status: paid ? "success" : "failed",
        vnpTxnRef: orderId,
        vnpTransactionNo: vnpParams.vnp_TransactionNo,
        vnpResponseCode: rspCode,
        vnpAmount: Number(vnpParams.vnp_Amount) / 100,
      },
    });
    return res.json({ RspCode: "00", Message: "Confirm Success", paid });
  }
  return res.json({ RspCode: "97", Message: "Invalid signature" });
});

module.exports = router;
