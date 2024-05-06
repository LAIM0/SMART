import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
  @Prop({ required: true, type: Buffer })
  imageData: Buffer;
}

export const ImageSchema = SchemaFactory.createForClass(Image);

// Ajout de la propriété virtuelle 'id'
ImageSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Confiuration pour s'assurer que le virtuel 'id' est inclus lors des conversions en JSON
ImageSchema.set('toJSON', {
  virtuals: true, // S'assure que les champs virtuels sont inclus
  versionKey: false, // Ne pas inclure __v
  transform: function (doc, ret) {
    delete ret._id; // Supprimer _id
  },
});
