import { InferSchemaType, Schema, model } from 'mongoose';

const InputSchema = new Schema({
  year: { type: Number, required: true },
  day: { type: Number, required: true },
  order: { type: Number, required: true },
  input: { type: String, required: true },
  mostRecent: Boolean,
  title: String,
});

InputSchema.index(
  {
    year: -1,
    day: 1,
    order: 1,
  },
  {
    unique: true,
  },
);

InputSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

export type Input = InferSchemaType<typeof InputSchema> & { id: string };

export type Inputs = {
  results: number;
  inputs: (Partial<Input> & { order: number; id: string })[];
};

export const InputModel = model<Input>('Input', InputSchema);
