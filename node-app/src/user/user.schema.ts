import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Définir le schéma Mongoose en utilisant les décorateurs de NestJS
@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    // Vous pouvez ajouter d'autres propriétés ici selon les besoins
}

// Créer le modèle Mongoose à partir du schéma
export const UserSchema = SchemaFactory.createForClass(User);
