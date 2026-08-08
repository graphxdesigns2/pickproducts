import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: ({ req }) => {
      // Admins (Users collection) can read everyone
      if (req.user && req.user.collection === 'users') {
        return true
      }
      // Customers can only read their own record
      if (req.user && (req.user.collection as string) === 'customers') {
        return { id: { equals: req.user.id } }
      }
      return false
    },
    create: () => true, // anyone can sign up
    update: ({ req }) => {
      if (req.user && req.user.collection === 'users') {
        return true
      }
      if (req.user && (req.user.collection as string) === 'customers') {
        return { id: { equals: req.user.id } }
      }
      return false
    },
    delete: ({ req }) => {
      if (req.user && req.user.collection === 'users') {
        return true
      }
      if (req.user && (req.user.collection as string) === 'customers') {
        return { id: { equals: req.user.id } }
      }
      return false
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Legacy full-name field (used by Google Sign-In). Prefer firstName/lastName below.',
      },
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Shipping Address',
    },
    {
      name: 'emailOptIn',
      type: 'checkbox',
      label: 'Receive order updates and promotions by email',
      defaultValue: true,
    },
    {
      name: 'cart',
      type: 'json',
      admin: {
        description: 'Saved cart contents (auto-managed by the storefront)',
      },
    },
  ],
}