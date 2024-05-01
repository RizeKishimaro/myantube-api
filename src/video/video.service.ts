import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class VideoService {
  constructor(private readonly prismaService: PrismaService){

  }
  create(createVideoDto: CreateVideoDto) {
    return "goffy ahhhh" ;
  }

  findAll() {
    const videos = this.prismaService.video.findMany();
    return videos;
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
