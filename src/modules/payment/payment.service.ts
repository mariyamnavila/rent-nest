import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import { PaymentMethod, PaymentStatus, RequestStatus } from "../../../generated/prisma/enums";

const createCheckoutSession = async (rentalRequestId: string, tenantId: string) => {
    // Retrieve the rental request
    const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
        where: {
            id: rentalRequestId,
        },
        include: {
            property: true,
            tenant: true,
        },
    });

    // Authorization and status checks
    if (rentalRequest.tenantId !== tenantId) {
        throw new Error("You do not have permission to pay for this rental request.");
    }

    if (rentalRequest.status !== RequestStatus.APPROVED) {
        throw new Error(`Cannot pay for a rental request that has status ${rentalRequest.status.toLowerCase()}.`);
    }

    // Cost calculation (months * monthly property price)
    const start = rentalRequest.startDate;
    const end = rentalRequest.endDate;

    const yearsDiff = end.getFullYear() - start.getFullYear();
    const monthsDiff = end.getMonth() - start.getMonth();
    const daysDiff = end.getDate() - start.getDate();

    let durationInMonths = (yearsDiff * 12) + monthsDiff + (daysDiff / 30);
    durationInMonths = Math.max(0.1, durationInMonths);

    const amount = Math.round(durationInMonths * rentalRequest.property.price * 100) / 100;

    // Create Stripe checkout session
    const appUrl = config.app_url || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/payment/cancel`,
        customer_email: rentalRequest.tenant.email,
        line_items: [
            {
                price_data: {
                    currency: "bdt",
                    product_data: {
                        name: rentalRequest.property.title,
                        description: `Rental from ${rentalRequest.startDate.toLocaleDateString()} to ${rentalRequest.endDate.toLocaleDateString()}`,
                    },
                    unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
            },
        ],
        metadata: {
            rentalRequestId,
            tenantId,
        },
    });

    // Create a local pending payment record
    const payment = await prisma.payment.create({
        data: {
            transactionId: session.id,
            amount: amount,
            method: PaymentMethod.STRIPE,
            status: PaymentStatus.PENDING,
            rentalRequestId,
            tenantId,
        },
    });

    return {
        checkoutUrl: session.url,
        payment,
    };
}

export const paymentService = {
    createCheckoutSession,
}
