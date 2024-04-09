import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CompletedDocument = Completed & Document;

@Schema()
export class Completed {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Challenge' })
  challengeId: Types.ObjectId;

  @Prop()
  completionDate: Date;
}

export const CompletedSchema = SchemaFactory.createForClass(Completed);

// Ajout de la propriété virtuelle 'id'
CompletedSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Confiuration pour s'assurer que le virtuel 'id' est inclus lors des conversions en JSON
CompletedSchema.set('toJSON', {
  virtuals: true, // S'assure que les champs virtuels sont inclus
  versionKey: false, // Ne pas inclure __v
  transform: function (doc, ret) {
    delete ret._id; // Supprimer _id
  },
});
