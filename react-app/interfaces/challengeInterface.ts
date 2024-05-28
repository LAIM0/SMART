import { Periodicity } from '../utils/constants';

interface ChallengeData {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  endDate: Date;
  pedagogicalExplanation: string;
  periodicity: Periodicity;
}

export default ChallengeData;
