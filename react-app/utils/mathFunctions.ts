const dateGap = (endDate: Date): number => {
  return (
    Math.floor(
      (new Date(endDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  );
};

export default dateGap;
