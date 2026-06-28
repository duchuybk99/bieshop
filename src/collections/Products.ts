import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { slugField } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'status', 'price', 'featured', 'updatedAt'],
    useAsTitle: 'name',
  },
  defaultPopulate: {
    name: true,
    slug: true,
    images: true,
    status: true,
    price: true,
    category: true,
    featured: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField({
      fieldToUse: 'name',
    }),
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
    {
      name: 'images',
      type: 'array',
      labels: {
        singular: 'Hình ảnh sản phẩm',
        plural: 'Hình ảnh sản phẩm',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'youtubeUrl',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'available',
      options: [
        {
          label: 'Còn hàng',
          value: 'available',
        },
        {
          label: 'Pre-order',
          value: 'preorder',
        },
        {
          label: 'Hết hàng',
          value: 'soldout',
        },
      ],
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
    },
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
  ],
  timestamps: true,
}
