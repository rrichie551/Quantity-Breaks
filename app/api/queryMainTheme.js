export const getMainTheme = `
query getThemes{
    themes(first:10,roles: MAIN){
        nodes{
            name
            id
        }
    }
} 

`;