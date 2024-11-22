import { CreateIssueOptions } from './issues.types';

export interface IIssuesService {
  // Création d'un nouveau signalement de problème
  createIssue(options: CreateIssueOptions): Promise<void>;
}
