
// Enum pour les types de problèmes
export enum IssueType {
  Technical = 'technical',
  User = 'user',
  Fleet = 'fleet',
}

// Interface pour le service de gestion des signalements
interface IIssueService {
  // Création d'un nouveau signalement de problème
  createIssue(options: Omit<IssueReport, 'createdAt'>): IssueReport;

  // Récupère tous les signalements, avec option de filtre par type de problème
  getAllIssues(type?: IssueType): IssueReport[];

  // Récupère un signalement spécifique par son ID
  getIssueById(id: string): IssueReport | undefined;

  // Marque un signalement comme résolu ou le met à jour
  resolveIssue(id: string): boolean;
}
