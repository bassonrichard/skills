# Web billing with Stripe

Checked against docs.stripe.com on 2026-11-16. Dashboard paths and defaults
change; re-check anything you are about to tell the user to click.

Much of the checklist on Stripe is **settings, not code**. Look at the
Dashboard state (or ask for it) before writing anything, and remember that
several features are on by default for newer accounts - score ❓, not ❌, when
you can't see them.

## What to read in the code

| Looking for | Typical place |
|---|---|
| Plans, prices, copy, highlight | pricing page / pricing component |
| How checkout is created | call to `checkout.sessions.create`, a Payment Link URL, or Elements + PaymentIntents |
| Which events are handled | Stripe webhook route |
| Free-tier caps | limits / entitlements module, usage checks |
| Cancel flow | billing settings page; `subscriptions.cancel`, `cancel_at_period_end`, or a customer-portal session |

## Checklist items on Stripe

**1.6 Annual plan.** Check both that an annual Price exists and that the UI
offers it. An annual price that exists in Stripe but isn't shown is ⚠️.

**1.7 Local currency - Adaptive Pricing.** The feature is called **Adaptive
Pricing**. Stripe picks the customer's local currency, converts the price and
guarantees the rate.
- Works with Checkout (hosted and embedded) and Payment Links. It is always on for Payment Links; for Checkout it is a toggle at **Settings → Adaptive Pricing**. It is **not available with Elements + the Payment Intents API**.
- Supports subscriptions; cross-border subscriptions are limited to cards, Link, Apple Pay and Google Pay.
- The business pays nothing extra; the **customer pays a 2-4% conversion fee** built into the rate. Tell the user this - it is a pricing decision, not a free win.
- A price with manual `currency_options` for a currency is used as-is for that currency; Adaptive Pricing covers the rest. Manual currency prices are the option when the user wants round local prices or regional pricing.
- Skipped when the session uses `capture_method: manual`, and the price currency must be one of the account's settlement currencies.
- A pricing page with hard-coded `$` strings shows USD to everyone even if checkout localises. Flag the mismatch.

**3.1 Wallets - Apple Pay / Google Pay.**
- With Stripe-hosted Checkout or Payment Links and dynamic payment methods, wallets are managed at **Settings → Payment methods** and need no domain setup.
- With **Elements or embedded Checkout**, each domain (and subdomain) showing the wallet must be registered at **Settings → Payment method domains**. Registration is required for Apple Pay. Stripe handles Apple's merchant validation; no Apple Merchant ID is needed.
- In code, a hard-coded `payment_method_types` list switches off dynamic payment methods, so methods enabled in the Dashboard don't appear. Removing it is usually the fix.

**3.3 / 4.1 Trials and the trial-ending reminder.**
- Built-in email: **Settings → Billing → Subscriptions and emails → "Send a reminder email 7 days before a free trial ends"**. For trials shorter than 7 days it goes out when the trial starts. Not sent in sandboxes.
- Own email: handle the `customer.subscription.trial_will_end` event. It fires 3 days before the trial ends by default (configurable under "Trial ending events").
- Card networks require a reminder and a cancellation link for trials, so this is a compliance item as well as a conversion one. Stripe's reminder and receipts include the cancellation URL when those settings are on; if the app sends its own, it carries that responsibility.
- Check what happens when a no-card trial ends: `trial_settings.end_behavior.missing_payment_method` (`create_invoice`, `cancel` or `pause`).

**4.2 Failed payments.** Three separate things - check each:
1. **Retries.** **Smart Retries** is enabled by default on new accounts (up to 8 retries within 2 weeks). Configure at **Billing → Revenue recovery → Retries**. If the account is recent, expect this ✅; older accounts may be on a custom schedule or off.
2. **Emails to the customer.** Not the same switch. **Billing → Revenue recovery → Emails → "Send emails when card payments fail"**, and "Send emails about expiring cards" (sent a month before expiry). These link the customer to a page where they update their card.
3. **What the app does meanwhile.** The webhook should handle `invoice.payment_failed` and the subscription moving to `past_due`; the app should keep or gracefully limit access and show an "update your card" prompt. Also check the end state after retries are exhausted (cancel, mark unpaid, leave past-due, or pause) at the same Retries page - "cancel" silently ends the relationship.

**4.3 Cancel flow.**
- The Stripe **customer portal** (**Settings → Billing → Customer portal → Cancellations**) can collect a cancellation reason from a fixed list and offer a **retention coupon** before the cancellation completes. Reasons show up on the subscription, in Sigma and on the `customer.subscription.updated` event.
- Pause and downgrade offers on cancel are not portal cancellation options; they need the app's own flow (plan switching in the portal is a separate setting).
- In code, `subscriptions.cancel(...)` called straight from a button, with no reason captured and no alternative offered, is ❌. Prefer cancelling at period end over immediately unless the user wants otherwise.

**4.4 Lapsed customers.** No single switch. Look for handling of `customer.subscription.deleted` that triggers a win-back message, or a coupon / promotion code used for returning customers.

## Sources

- Smart Retries: https://docs.stripe.com/billing/revenue-recovery/smart-retries
- Customer emails: https://docs.stripe.com/billing/revenue-recovery/customer-emails
- Adaptive Pricing: https://docs.stripe.com/payments/currencies/localize-prices/adaptive-pricing
- Payment method domains: https://docs.stripe.com/payments/payment-methods/pmd-registration
- Trial compliance: https://docs.stripe.com/billing/subscriptions/trials/manage-trial-compliance
- Cancellation page: https://docs.stripe.com/customer-management/cancellation-page
