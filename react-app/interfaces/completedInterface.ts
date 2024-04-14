import { Periodicity } from '../utils/constants';

interface CompletedChallengeData {
  completed: {
    id: string;
    userId: string;
    challengeId: string;
    completionDate: Date;
  };
  challenge: {
    id: string;
    category: string;
    title: string;
    points: number;
    description: string;
    pedagogicalExplanation: string;
    endDate: Date;
    periodicity: Periodicity;
  };
}

export default CompletedChallengeData;
