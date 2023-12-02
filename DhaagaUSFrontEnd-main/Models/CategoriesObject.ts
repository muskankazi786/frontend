// export interface CategoriesObject {
//   [key: string]: boolean;
//   restaurants: boolean;
//   henna: boolean;
//   roomMates: boolean;
//   homeFood: boolean;
//   clothing: boolean;
//   jewelry: boolean;
//   salon: boolean;
//   grocery: boolean;
// }

export interface CategoriesObject {
  category: string;
  query: string;
  svg: JSX.Element;
  isActive: boolean;
}
