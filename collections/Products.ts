import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'cat', 'price',],
  },
  access: {
    read: () => true, // public can read products (needed for storefront)
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
  ],
}