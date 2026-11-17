# Mobile in-app purchases (App Store, Google Play, RevenueCat, Expo)

Checked against Apple, Google and RevenueCat documentation on 2026-11-16.
Store rules move faster than anything else in this skill - section 6 in
particular must be re-checked on the day of the audit.

On mobile the stores own checkout, wallets, receipts and payment retries.
Don't recommend Stripe features (Smart Retries, wallet toggles, the customer
portal) for in-app purchases - they don't apply. What the developer controls
is the paywall, where it appears, the store configuration, and what the app
does with subscription state.

## What to read

| Looking for | Typical place in an Expo / React Native app |
|---|---|
| Paywall copy, plans, prices | paywall screen; `Purchases.getOfferings()`, `offering.availablePackages` |
| Where the paywall is shown | navigation calls to the paywall; limit checks |
| Entitlement checks | `customerInfo.entitlements.active[...]` |
| Free-tier caps | constants / limits module |
| Restore and manage | `Purchases.restorePurchases()`, a manage-subscription link, RevenueCat Customer Center |
| Store setup | not in the repo - ask for App Store Connect / Play Console / RevenueCat state |

Real purchases need a development or store build with a sandbox account;
they can't be exercised in Expo Go.

## 1. Paywall rules that are also review rules

These are checklist items 1.6, 1.7 and 3.3 with store requirements attached.
A paywall that breaks them risks rejection, so score them strictly.

- **Prices come from the store, never from a string in the code.** Render the product's localised price (`product.priceString` in RevenueCat). Both stores already convert and charge in the buyer's currency; a hard-coded "$2.99" shows the wrong price to most of the world and can mismatch the purchase sheet.
- **The billed amount is the most prominent price.** Apple: "the amount that will be billed must be the most prominent pricing element in the layout". For an annual plan the yearly total leads; a per-month equivalent or a saving may be shown, smaller and subordinate. This reverses the common web habit of headlining the monthly equivalent - on iOS that is a rejection risk.
- **Trial terms on the purchase screen:** how long the trial lasts and the price billed when it ends.
- **Say what the user gets** for the price before asking them to subscribe (App Review guideline 3.1.2(c)).
- **Restore purchases** is available to existing subscribers, and the app links to its **Terms of Use and Privacy Policy**.
- **Cancelling is easy to find:** link to the system subscription-management screen. Routing cancellation through a support email is a dark pattern and against Apple's guidance.

## 2. Pricing by country (1.7)

- **App Store:** setting one price generates comparable prices for all 175 storefronts, adjusted for tax and exchange rate; each can be edited per storefront. 800 price points per currency. Worth reviewing the large markets by hand rather than accepting pure conversion - purchasing power differs.
- **Google Play:** prices are set per region on each base plan; "Update prices" converts and applies local pricing conventions.
- Price increases: Apple lets existing subscribers keep their current price ("Keep the current price for existing subscribers"), and may require consent otherwise. Google has opt-in and opt-out increases and legacy price cohorts. Raising a price is a user decision with these consequences spelled out.

## 3. Offers (1.5, 4.1, 4.4)

**App Store**
- **Introductory offer** - new subscribers, one per subscription group: free trial, pay-as-you-go or pay-up-front.
- **Promotional offers** - existing or former subscribers; the app decides who sees them (up to 10 per subscription). The tool for exit offers and upgrades.
- **Win-back offers** - lapsed subscribers; Apple determines eligibility and can show them on the App Store, in the app and in subscription settings.
- **Offer codes** - one-time or custom codes for campaigns.
- Keep all plans in **one subscription group**, ranked by level, so upgrades and downgrades work and nobody holds two subscriptions.

**Google Play**
- Subscriptions have **base plans**; **offers** attach to a base plan with pricing phases (free trial, single payment, recurring).
- Eligibility: **New customer acquisition**, **Upgrade**, or **Developer determined** - the last is how win-back and second-chance trials are done.

**Trial reminder (4.1).** Don't rely on the stores' own emails. If the app has notification permission or an email address, send a reminder a couple of days before the trial converts, and show the timeline on the paywall ("today: full access - day 5: reminder - day 7: billing starts").

## 4. Failed payments (4.2)

- **App Store - billing retry** is automatic: Apple attempts to recover a failed renewal for 60 days. Nothing to enable.
- **App Store - Billing Grace Period** is opt-in and per app: subscribers keep access for 3, 16 or 28 days while Apple retries (weekly plans cap at 6 days). Path: **App Store Connect → Apps → the app → Subscriptions → Billing Grace Period → Set Up Billing Grace Period**. Recovery inside the grace period means no interruption to service or revenue. If the user hasn't set it up, this is one of the cheapest fixes on the list.
- **Google Play - grace period and account hold** are configured on each auto-renewing base plan. Account hold is on by default and runs for 60 days minus the grace period; users have no access during hold.
- **In the app:** read the billing-issue state (RevenueCat exposes it on the entitlement) and show an "update your payment method" prompt that opens the store's subscription settings. With a grace period on, keep access during it.

## 5. RevenueCat

- **Offerings → Packages → Products.** The current offering decides what the paywall sells; check that every package in it is actually shown (an annual package that exists but isn't rendered is ⚠️ for 1.6).
- **Paywalls** are remotely configured screens attached to an offering, changeable without an app release, on iOS, Android and React Native (`react-native-purchases`). **Experiments** A/B-test offerings and paywalls. Useful when the audit ends in "test two prices" - but an existing hand-built paywall that follows section 1 doesn't need replacing.
- **Customer Center** gives an in-app self-service screen: cancel, a "why are you leaving" survey, **retention offers shown automatically**, restore purchases, and (iOS only) refund requests and plan changes. It covers checklist 4.3 on mobile. Available on RevenueCat Pro and Enterprise plans - mention the plan requirement.

## 6. Linking out to web checkout

Selling the same subscription on the web avoids store fees, so users ask
about it. The rules differ by store, country and month, and several are under
active litigation. **Never present this as settled.** Give the user the
snapshot below as a starting point, check the primary sources today, and frame
it as their decision.

Snapshot on 2026-11-16:

- **Apple, United States storefront.** The App Review Guidelines (3.1.1(a), 3.1.3) say buttons, external links and other calls to action to other purchase methods are allowed in US storefront apps, with no entitlement needed. In-app purchase must still be offered for digital goods. What commission Apple may charge on those link-outs is unresolved: the appeals court allowed some commission in December 2025 and sent the question back to the district court; press reports say Apple has proposed rates and Epic opposes them. Treat the cost as unknown.
- **Apple, other storefronts.** Links to other purchase methods are prohibited unless the app holds an entitlement that exists only for specific regions and platforms (the EU among them, on separate terms). An app sold worldwide therefore has to show the link only on storefronts where it is permitted.
- **Google Play, United States.** External content links and alternative billing are allowed through programs that require enrolment, transaction reporting and service fees (fees began 1 October 2026). A settlement with Epic from March 2026 is awaiting a revised court order, so terms may change again.
- **Google Play, UK and EEA.** A separate billing-choice programme with its own fees opened mid-2026 (press reports; confirm on Google's pages).
- **Everywhere:** telling users about web pricing *outside* the app (email, website) is allowed by both stores.

Primary sources to re-check:
- Apple App Review Guidelines, section 3.1: https://developer.apple.com/app-store/review/guidelines/
- Apple StoreKit external purchase documentation: https://developer.apple.com/documentation/storekit/external-purchase
- Google Play, policies for developers serving US users: https://support.google.com/googleplay/android-developer/answer/15582165
- Google Play billing choice enrolment: https://support.google.com/googleplay/android-developer/answer/17161464

## Sources for sections 1-5

- Apple, auto-renewable subscriptions: https://developer.apple.com/app-store/subscriptions/
- Apple, Billing Grace Period: https://developer.apple.com/help/app-store-connect/manage-subscriptions/enable-billing-grace-period-for-auto-renewable-subscriptions/
- Apple, subscription pricing: https://developer.apple.com/help/app-store-connect/manage-subscriptions/manage-pricing-for-auto-renewable-subscriptions/
- Google Play, subscriptions: https://support.google.com/googleplay/android-developer/answer/140504
- RevenueCat Paywalls: https://www.revenuecat.com/docs/tools/paywalls
- RevenueCat Customer Center: https://www.revenuecat.com/docs/tools/customer-center
