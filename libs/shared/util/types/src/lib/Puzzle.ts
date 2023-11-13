import { InferSchemaType, Schema, model } from 'mongoose';

const NestedPuzzleNodeSchema = new Schema(
  {
    name: { type: String, required: true },
    nodeType: { type: Number, required: true },
    attributes: { type: Map, of: String },
    text: String,
  },
  { _id: false },
);

NestedPuzzleNodeSchema.add({
  childNodes: [NestedPuzzleNodeSchema],
});

const PuzzleNodeSchema = NestedPuzzleNodeSchema;

export const elementTags = ['main', 'article', 'h2', 'p', 'a', 'em', 'pre', 'code', 'ul', 'li', 'span', 'br'];
type ElementTag = (typeof elementTags)[number];

export interface PuzzleTextNode {
  name: '#text';
  nodeType: Node['TEXT_NODE'];
  text: string;
}
export interface PuzzleElementNode {
  name: ElementTag;
  nodeType: Node['ELEMENT_NODE'];
  attributes: { [name: string]: string };
  childNodes: PuzzleNode[];
}
export type PuzzleNode = PuzzleTextNode | PuzzleElementNode;

const PuzzleSchema = new Schema({
  year: { type: Number, required: true },
  day: { type: Number, required: true },
  main: PuzzleNodeSchema,
});

PuzzleSchema.index(
  {
    year: -1,
    day: 1,
  },
  {
    unique: true,
  },
);

PuzzleSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

export type Puzzle = {
  [P in keyof InferSchemaType<typeof PuzzleSchema>]: P extends 'main' ? PuzzleElementNode : InferSchemaType<typeof PuzzleSchema>[P];
} & { id: string };

export const PuzzleModel = model<Puzzle>('Puzzle', PuzzleSchema);
