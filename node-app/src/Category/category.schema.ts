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

// Ajout de la propriété virtuelle 'id'
CategorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Confiuration pour s'assurer que le virtuel 'id' est inclus lors des conversions en JSON
CategorySchema.set('toJSON', {
  virtuals: true, // S'assure que les champs virtuels sont inclus
  versionKey: false, // Ne pas inclure __v
  transform: function (doc, ret) {
    delete ret._id; // Supprimer _id
  },
});
