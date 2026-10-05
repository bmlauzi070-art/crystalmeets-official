import { defineField, defineType } from 'sanity';

export const meetEvent = defineType({
  name: 'meet',
  title: 'Car Meet',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Meet Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'date', title: 'Event Date & Time', type: 'datetime', validation: Rule => Rule.required() }),
    defineField({ name: 'location_name', title: 'Venue Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'address', title: 'Full Address', type: 'string' }),
    defineField({ name: 'lat', title: 'Latitude', type: 'number', validation: Rule => Rule.required() }),
    defineField({ name: 'lon', title: 'Longitude', type: 'number', validation: Rule => Rule.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: ['Cars & Coffee', 'JDM', 'German', 'Supercars', 'Track', 'Classic', 'Rally', 'Drift', 'Charity'] },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'fuel_type',
      title: 'Fuel Type',
      type: 'string',
      options: { list: ['Petrol', 'EV'] },
      initialValue: 'Petrol'
    }),
    defineField({ name: 'price', title: 'Price', type: 'string', initialValue: 'Free' }),
    defineField({ name: 'image', title: 'Meet Image', type: 'image', options: { hotspot: true } }),
  ],
});
