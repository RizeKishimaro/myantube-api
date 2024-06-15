import { Test, TestingModule } from '@nestjs/testing';
import { FactoryService } from './factory.service';

describe('FactoryService', () => {
  let service: FactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FactoryService],
    }).compile();

    service = module.get<FactoryService>(FactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
