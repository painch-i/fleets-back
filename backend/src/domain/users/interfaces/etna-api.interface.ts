export type EtnaUserInfo = {
  firstName: string;
  lastName: string;
};

export interface IEtnaApi {
  getUserInfo: (login: string) => Promise<EtnaUserInfo>;
}
