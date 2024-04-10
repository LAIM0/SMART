interface CompletedChallenge {
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
  };
}

export default CompletedChallenge;
