import { InferSchemaType, Schema, model } from 'mongoose';

const CalendarSchema = new Schema({
  year: { type: Number, required: true, unique: true },
  days: {
    type: [
      {
        stars: { type: Number, default: 0 },
        title: { type: String, default: '' },
        _id: false,
      },
    ],
    required: true,
  },
});

CalendarSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

export type Calendar = InferSchemaType<typeof CalendarSchema> & { id: string };

export const CalendarModel = model<Calendar>('Calendar', CalendarSchema);
