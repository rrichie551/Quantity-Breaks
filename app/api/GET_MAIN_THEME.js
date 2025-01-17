export const GET_MAIN_THEME = `
query getThemes{
    themes(first:10,roles: MAIN){
    nodes{
      name
      id
    }
  }
  } 

`