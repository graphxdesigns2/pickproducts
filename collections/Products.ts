import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'cat', 'price', 'cjPid'],
  },

  access: {
    read: () => true, // Publicly readable for your storefront
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'cat',
      type: 'relationship',
      relationTo: 'categories',
      required: false,
      label: 'Category',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'was',
      type: 'number',
      label: 'Original price (if on sale)',
    },
    {
      name: 'trending',
      type: 'checkbox',
      label: 'Show on homepage (Trending)',
      defaultValue: false,
    },
    {
      name: 'carousel',
      type: 'checkbox',
      label: 'Show on rotating product wheel',
      defaultValue: false,
    },
    {
      name: 'sizes',
      type: 'array',
      fields: [
        {
          name: 'size',
          type: 'text',
        },
      ],
    },
    {
      name: 'desc',
      type: 'textarea',
      label: 'Description',
    },

    // --- CJ Dropshipping Integration Fields ---
    {
      name: 'cjPid',
      type: 'text',
      index: true,
      label: 'CJ Product ID (PID)',
      admin: {
        description: 'Unique product ID from CJ Dropshipping',
      },
    },
    {
      name: 'cjSku',
      type: 'text',
      label: 'CJ SKU',
    },
    {
      name: 'cjCostPrice',
      type: 'number',
      label: 'CJ Wholesale Cost',
      admin: {
        description: 'Original supplier price from CJ Dropshipping',
      },
    },
    {
      name: 'cjImage',
      type: 'text',
      label: 'CJ Image URL',
      admin: {
        description: 'Direct image CDN URL from CJ Dropshipping',
      },
    },
  ],
}
// Trigger commit