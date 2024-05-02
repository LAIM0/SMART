interface CategoryData {
  categoryName: string;
  id: string;
  challengeCount?: number;
}

export interface CategoryDataWithDate {
  categoryName: string;
  creationDate: Date;
  id: string;
}

export default CategoryData;
