import React from 'react';
import { Flex, useBreakpointValue } from '@chakra-ui/react';
import CategoryCard from './CategoryCard';
import { ScoreByCatData } from '../../interfaces/userInterface';

interface CategoryListProps {
  listScore: ScoreByCatData[];
}

function CategoryList({ listScore }: CategoryListProps) {
  const gap = useBreakpointValue({ base: '20px', md: '30px' });
  const justifyContent = useBreakpointValue({
    base: 'center',
    md: 'flex-start',
  });
  return (
    <Flex
      flexDirection="row"
      flexWrap="wrap"
      gap={gap}
      justifyContent={justifyContent}
      mb="24px"
    >
      {listScore.map(
        (item) =>
          item.score !== 0 && (
            <CategoryCard
              categoryName={item.category.categoryName}
              score={item.score}
            />
          )
      )}
    </Flex>
  );
}

export default CategoryList;
