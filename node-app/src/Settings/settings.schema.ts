import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingsDocument = Settings & Document;

@Schema()
export class Settings {
  @Prop()
  color1: string;

  @Prop()
  color2: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);

// Ajout de la propriété virtuelle 'id'
SettingsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Confiuration pour s'assurer que le virtuel 'id' est inclus lors des conversions en JSON
SettingsSchema.set('toJSON', {
  virtuals: true, // S'assure que les champs virtuels sont inclus
  versionKey: false, // Ne pas inclure __v
  transform: function (doc, ret) {
    delete ret._id; // Supprimer _id
  },
});
