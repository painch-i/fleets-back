import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../infrastructure/persistence/read-database/prisma/prisma.service';
import { NavigationCsvRepository } from '../../infrastructure/repositories/navigation-csv.repository';
import { NavigationRepository } from '../../infrastructure/repositories/navigation.repository';
import { NavigationManager } from './navigation.manager';

describe('NavigationManager', () => {
  let navigationManager: NavigationManager;
  let navigationRepository: NavigationRepository;
  let navigationCsvRepository: NavigationCsvRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NavigationManager,
        NavigationRepository,
        NavigationCsvRepository,
        PrismaService,
      ],
    }).compile();

    navigationManager = module.get<NavigationManager>(NavigationManager);
    navigationRepository =
      module.get<NavigationRepository>(NavigationRepository);
    navigationCsvRepository = module.get<NavigationCsvRepository>(
      NavigationCsvRepository,
    );
  });

  describe('getLines', () => {
    it('should return an array of Line objects', async () => {
      // // Mock the behavior of navigationRepository.getLines
      // const mockLines: Line[] = [
      //   /* Create mock Line objects here */
      // ];
      // jest.spyOn(navigationRepository, 'getLines').mockResolvedValue(mockLines);

      const result = await navigationManager.getLines();
      // expect(result).toEqual(mockLines);
    });
  });

  describe('refreshNavigationData', () => {
    jest.setTimeout(1000 * 60 * 60);
    it('should insert lines into the repository', async () => {
      // // Mock the behavior of navigationCsvRepository.iterateLines
      // const mockCsvLines: string[] = [
      //   /* Mock CSV lines here */
      // ];
      // jest
      //   .spyOn(navigationCsvRepository, 'iterateLines')
      //   .mockResolvedValue(mockCsvLines);
      // // Mock the behavior of navigationRepository.createManyLines
      // const mockInsertResult = {
      //   /* Mock insert result here */
      // };
      // jest
      //   .spyOn(navigationRepository, 'createManyLines')
      //   .mockResolvedValue(mockInsertResult);
      // await navigationManager.refreshNavigationData();
      // // Verify that createManyLines was called with the expected lines
      // expect(
      //   navigationRepository.createManyLines,
      // ).toHaveBeenCalledWith(/* Expected lines to insert */);
    });
  });
});
