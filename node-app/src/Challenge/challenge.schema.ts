import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChallengeDocument = Challenge & Document;

enum Periodicity {
  DAILY = 'Quotidien',
  WEEKLY = 'Hebdomadaire',
  MONTHLY = 'Mensuel',
}

@Schema()
export class Challenge {
  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category?: Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  points?: number;

  @Prop()
  description?: string;

  @Prop()
  pedagogicalExplanation?: string;

  @Prop()
  photo?: string;

  @Prop()
  endDate?: Date;

  @Prop({ type: String, enum: Periodicity })
  periodicity?: Periodicity;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);

// Ajout de la propriété virtuelle 'id'
ChallengeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Confiuration pour s'assurer que le virtuel 'id' est inclus lors des conversions en JSON
ChallengeSchema.set('toJSON', {
  virtuals: true, // S'assure que les champs virtuels sont inclus
  versionKey: false, // Ne pas inclure __v
  transform: function (doc, ret) {
    delete ret._id; // Supprimer _id
  },
});
