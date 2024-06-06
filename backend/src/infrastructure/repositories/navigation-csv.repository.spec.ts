import { NavigationCsvRepository } from './navigation-csv.repository';

// Mock des dépendances HTTP
jest.mock('https', () => ({
  request: jest.fn(),
}));

describe('NavigationCsvRepository', () => {
  let repository: NavigationCsvRepository;

  jest.setTimeout(10000);
  beforeEach(() => {
    repository = new NavigationCsvRepository();
  });

  it('should iterate over CSV lines', async () => {
    const results: any[] = [];
    const iterator = repository.iterateLines();

    for await (const line of iterator) {
      results.push(line);
    }
    console.log(results.length);

    // expect(results).toEqual(['line1', 'line2']);
  });
});
