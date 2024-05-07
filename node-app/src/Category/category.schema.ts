import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  [x: string]: any;
  @Prop({ unique: true })
  categoryName: string;

  @Prop()
  creationDate: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

CategorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false, // Ne pas inclure __v
  transform: function (doc, ret) {
    delete ret._id;
  },
});
