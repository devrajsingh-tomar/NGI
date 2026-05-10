import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "";

const isDummyKey = !razorpayKeyId || razorpayKeyId === "your_razorpay_key_id";

const razorpay = !isDummyKey ? new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
}) : null;

export async function createRazorpayOrder(amount: number, currency: string = "INR") {
    // Dummy mode if no keys
    if (!razorpay) {
        console.warn("⚠️ RAZORPAY KEYS MISSING: Running in DUMMY mode.");
        return {
            id: `order_mock_${Date.now()}`,
            amount: amount * 100,
            currency,
            notes: ["DUMMY_MODE"]
        };
    }

    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        throw new Error("Failed to create Razorpay order");
    }
}

export function verifyRazorpaySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    signature: string
) {
    // Dummy verification
    if (razorpayOrderId.startsWith("order_mock_")) {
        return signature === "mock_signature_success";
    }

    if (!razorpayKeySecret) return false;

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
        .createHmac("sha256", razorpayKeySecret)
        .update(body.toString())
        .digest("hex");

    return expectedSignature === signature;
}
