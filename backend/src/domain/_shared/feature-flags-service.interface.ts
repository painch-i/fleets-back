export interface IFeatureFlagsService {
  isEnabled(flag: string): boolean;
}
