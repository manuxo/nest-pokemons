import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Location } from './entities/location.entity';
import { isValidObjectId, Model } from 'mongoose';
import { LocationResponse } from './interfaces/location-response.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class LocationService {

  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<Location>,
    private readonly http: AxiosAdapter
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    createLocationDto.name = createLocationDto.name.toLocaleLowerCase();
    try {
      const location = await this.locationModel.create(createLocationDto);
      return location;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return this.locationModel.find();
  }

  async findOne(term: string) {
    let location: Location;
    if (!isNaN(+term)) {
      location = await this.locationModel.findOne({ no: term });
    }
    if (!location && isValidObjectId(term)) {
      location = await this.locationModel.findById(term);
    }
    if (!location) {
      location = await this.locationModel.findOne({ name: term.toLowerCase().trim() });
    }
    if (!location) {
      throw new NotFoundException(`Location with id, name or no ${term} not found`);
    }
    return location;
  }

  async remove(id: string) {
    const { deletedCount } = await this.locationModel.deleteOne({ _id: id });
    if (!deletedCount) {
      throw new NotFoundException(`Location with id ${id} not found`);
    }
    return;
  }

  async executeSeed() {
    await this.locationModel.deleteMany({});
    const data = await this.http.get<LocationResponse>('https://pokeapi.co/api/v2/location?limit=100');
    const locationsToInsert = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      return { no, name };
    });
    await this.locationModel.insertMany(locationsToInsert);
    return;
  }

  handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Location exists in db ${JSON.stringify(error.keyValue)}`);
    }
    console.error(error);
    throw new InternalServerErrorException(`Can't create Location - check logs`);
  }
}
