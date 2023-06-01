export interface IProfile {
  name: string;
  hasHeaders: boolean;
  filterColumn: string;
  selectedFilterColumnValues: string[];
  selectedHeaders: string[];
}
