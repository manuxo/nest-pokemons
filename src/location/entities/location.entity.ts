import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Location {
    
    @Prop({
        unique: true,
        index: true,
    })
    name: string;

    @Prop({
        unique: true,
        index: true,
    })
    no: number;

}

export const LocationSchema = SchemaFactory.createForClass(Location);
