import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationSchema } from './entities/location.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [LocationController],
  providers: [LocationService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Location',
        schema: LocationSchema,
      }
    ]),
    CommonModule,
  ],
  exports: [
    LocationService
  ]
})
export class LocationModule {}
