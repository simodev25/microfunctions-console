export interface IMainChart {
  name: string,
  data: number[],
  categories: string[],
  min?: number;
  max?: number;
  type:'CPU' | 'MEMORY'
};
