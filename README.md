# T-Shop (Tech-Shop)
### Full Stack E-Commerce App with an Admin Dashboard & CMS in 2024 | Next 14, Stripe
![e-commerce](https://github.com/developernajib/t-shop/assets/82390004/99d4c4a4-0efa-4990-a0a9-922f5a664c91)


## Production

To run this application in production, you need to build and serve the Admin panel. To do so, follow these steps:

1. Invoke the `build` script by running `yarn build` or `npm run build` in your project root. This creates a `./build` directory with a production-ready admin bundle.
1. Finally run `yarn serve` or `npm run serve` to run Node in production and serve application from the `./build` directory.
1. When you're ready to go live, see [Deployment](#deployment) for more details.

### Deployment

Before deploying your app, you need to:

1. Switch [your Stripe account to live mode](https://stripe.com/docs/test-mode) and update your [Stripe API keys](https://dashboard.stripe.com/test/apikeys). See [Connect Stripe](#connect-stripe) for more details.
1. Ensure your app builds and serves in production. See [Production](#production) for more details.


## Questions

If you have any issues or questions, reach out to us on [Telegram](https://t.me/developernajib) or start a [GitHub discussion](https://github.com/developernajib/t-shop/discussions).
