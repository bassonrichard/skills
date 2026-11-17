---
name: monetization-audit
description: Audit how an app asks for money - pricing, plans, paywall, free-tier limits, checkout, trials, failed-payment recovery and the cancel flow - against a checklist of proven conversion practices, score each item with evidence, then fix the gaps. Covers web billing (Stripe) and mobile in-app purchases (App Store, Google Play, RevenueCat, Expo/React Native). Use whenever the user says nobody is paying or upgrading, conversion or revenue is low, churn is high, asks about pricing, plans, paywalls, trials, upgrades, subscriptions, or is adding or reviewing payments in an app - even if they only ask "why isn't my app making money?".
---

# Monetization audit

Apps that don't convert are rarely missing a feature. They are missing the
plumbing around asking for money: an offer worth saying yes to, a moment to
ask, a checkout that doesn't leak, and recovery when a payment or a customer
slips. This skill checks that plumbing item by item and fixes what is missing.

## How to run it

1. **Find the billing path.** Web (Stripe or similar), mobile in-app purchase (StoreKit / Play Billing, usually through RevenueCat), or both. Then read the matching reference before scoring anything:
   - Web: `references/web-stripe.md`
   - iOS / Android / Expo: `references/mobile-iap.md`

   The same checklist item is a code change on one platform, a dashboard toggle on another, and a store-rule violation on a third, so the references decide what "present" means and what the fix is.

2. **Gather evidence.** Read the code: pricing page or paywall, checkout or purchase call, webhook / entitlement handling, plan limits, onboarding, cancel flow, lifecycle emails or notifications. For provider settings, use whatever the user can show (notes, screenshots, exports). Don't assume either way.

3. **Score every item** in the checklist below:
   - ✅ present, ⚠️ partial, ❌ missing - each with the file and line, or the setting, that shows it.
   - ❓ unknown - for settings you can't see. Give the exact place to look. Marking an unseen setting ❌ sends the user to fix something that may already be on (several recovery features are on by default).

4. **Rank by money lost.** The checklist is ordered offer → upgrade moment → checkout → recovery, which is roughly funnel order. Within that, lead with what affects the most users: a paywall nobody reaches matters more than a missing exit offer.

5. **Fix.** Change code when the user wants changes made. For provider or store settings, write the click-path and stop there. For prices, limits and discounts, propose and let the user choose.

## Ground rules

- **Propose prices, never invent them.** You don't know the user's costs, market or margins. Give a suggested range with the reasoning (value of the outcome, what alternatives charge, what the current price signals) and label it as a proposal for them to decide. The same goes for free-tier limits and discount sizes.
- **Live billing configuration is the user's to change.** Stripe Dashboard, App Store Connect, Play Console and RevenueCat settings affect real customers and real money. Describe the change; don't make it.
- **No dark patterns.** Cancelling stays easy, trial terms are stated before purchase, prices shown are the prices charged. This is not only ethics: card networks and both app stores require it, and hostile flows are paid back in chargebacks, refunds, bad reviews and app rejection.
- **Provider facts go stale.** The references are dated. Before leaning on anything policy-like (fees, what may be linked to, default settings), check the provider's current page and say what you checked and when. If you can't check, say that instead of asserting.

## Checklist

### 1. Offer - what is being sold

| # | Item | What good looks like |
|---|---|---|
| 1.1 | Outcome, not features | Paywall and pricing copy lead with what the user gets done ("Send an invoice in 30 seconds"); features sit underneath as proof |
| 1.2 | Not underpriced | A plan around $3/month signals a toy, attracts the highest-churn users and can't pay for support or acquisition. Flag it and propose a range |
| 1.3 | Three plans at most | More choices, more people choosing nothing |
| 1.4 | One plan highlighted | The plan most people should take is badged, contrasted or pre-selected |
| 1.5 | Decoy ("popcorn") pricing | A neighbouring plan is positioned so the target plan is plainly the better deal - the medium popcorn that sells the large |
| 1.6 | Annual plan with a visible saving | Annual is offered next to monthly with the saving stated. A monthly-equivalent figure helps comparison - but see the platform reference for how prominent it may be |
| 1.7 | Local currency | People see and pay prices in their own currency, from the provider's localisation rather than hard-coded strings |

### 2. Free tier and upgrade moments

| # | Item | What good looks like |
|---|---|---|
| 2.1 | Free plan is capped | The cap is on the thing that tracks value (projects, exports, AI uses): generous enough to reach the aha moment, tight enough that engaged users hit it |
| 2.2 | Upgrade shown at the limit | Hitting a cap opens the upgrade in context, naming what the user was trying to do. It is the highest-intent moment in the product |
| 2.3 | Pricing inside the app | Reachable from settings and from every limit, not only from the marketing site |
| 2.4 | Onboarding reaches the aha moment | Count the steps between install or signup and first real value; everything deferrable is deferred |

### 3. Checkout

| # | Item | What good looks like |
|---|---|---|
| 3.1 | One-tap payment | Apple Pay / Google Pay available on web; native purchase sheet on mobile. Typing a card number on a phone is where checkouts die |
| 3.2 | Minimal steps | No account detail demanded before payment that could be asked after |
| 3.3 | Terms shown before purchase | Price, billing period, trial length and what happens when the trial ends are on the screen where the user commits |

### 4. Retention and recovery

| # | Item | What good looks like |
|---|---|---|
| 4.1 | Trial-ending reminder | A message before the trial converts: what they did, what they keep, the date and the price. Fewer surprise charges, refunds and disputes |
| 4.2 | Failed payments recovered | Automatic retries, a message asking the customer to fix their payment method, and the app keeping sensible access while that happens. Involuntary churn is a large share of churn and the cheapest to win back |
| 4.3 | Cancel flow asks and offers | Asks why, then offers the fitting alternative (pause, downgrade, discount). Cancelling itself stays one or two taps |
| 4.4 | Lapsed customers get a way back | A win-back offer or message for people who cancelled or whose payment never recovered |

## Report format

Use this structure so audits are comparable over time:

```markdown
# Monetization audit: <app>
Billing path: <web Stripe | iOS + Android IAP via RevenueCat | ...>   Date: <date>

## Top fixes
1. <fix> - <why it is worth the most> - <code change | setting | decision for you>
2. ...
3. ...

## Scorecard
| # | Item | Status | Evidence | Fix |
|---|---|---|---|---|
| 1.1 | Outcome, not features | ❌ | `app/pricing/page.tsx:12` lists features only | Rewrite headline around the outcome |

## Decisions for you
- Prices / limits / discounts proposed, each with reasoning and a range.

## Settings to change yourself
- <Provider> → <exact path> → <setting>: <current state if known> → <recommended>

## Not verified
- Anything marked ❓, and any provider fact you could not check today.
```

Score all items, including the ones that pass - a short ✅ row tells the user
what not to worry about.

Source: checklist distilled from Jesse Eisenbart (@jesseeisenbart) on TikTok; provider specifics verified against Stripe, Apple, Google and RevenueCat documentation (see references).
