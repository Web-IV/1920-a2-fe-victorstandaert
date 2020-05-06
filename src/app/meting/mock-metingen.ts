import { Meting } from './meting.model';

const JsonMetingen = [
  {
    id: '1',
    resultaten: ['3', '46', '50', '20', '98'],
    dateAdded: '2020-02-07T18:25:43.511Z'
  },
  {
    id: '2',
    resultaten: ['12', '50', '69', '100'],
    dateAdded: '2020-02-08T16:25:43.511Z'
  }
];
export const METINGEN: Meting[] = JsonMetingen.map(Meting.fromJSON);
