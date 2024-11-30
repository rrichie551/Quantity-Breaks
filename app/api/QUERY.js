export const QUERY = `query{
    shopifyFunctions(first: 10){
        edges{
            node{
                id
                title
            }
        }
    }
  }
`;
