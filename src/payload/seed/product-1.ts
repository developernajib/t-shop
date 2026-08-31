export const product1: any = {
  title: 'Cotton T-Shirt',
  stripeProductID: '',
  slug: 'cotton-t',
  _status: 'published',
  enableVariants: true,
  variants: [
    {
      sku: 'TSHIRT-S-WHITE',
      title: 'Size S / White',
      size: 's',
      color: 'White',
      stock: 15,
    },
    {
      sku: 'TSHIRT-M-BLACK',
      title: 'Size M / Black',
      size: 'm',
      color: 'Black',
      stock: 20,
    },
    {
      sku: 'TSHIRT-L-NAVY',
      title: 'Size L / Navy',
      size: 'l',
      color: 'Navy',
      stock: 0,
    },
  ],
  meta: {
    title: 'Cotton T-Shirt',
    description: 'Make a one-time purchase for this physical product.',
    image: '{{PRODUCT_IMAGE}}',
  },
  layout: [
    {
      blockType: 'content',
      columns: [
        {
          size: 'twoThirds',
          richText: [
            {
              children: [
                {
                  text: "This content is completely dynamic using custom layout building blocks configured in the CMS. This can be anything you'd like from rich text and images, to highly designed, complex components.",
                },
              ],
            },
          ],
          link: {
            reference: null,
            url: '',
            label: '',
          },
        },
      ],
    },
  ],
  relatedProducts: [], // this is populated by the seed script
}
