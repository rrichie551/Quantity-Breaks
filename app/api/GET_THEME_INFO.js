export const GET_THEME_INFO = `query getTheme($themeId: ID!){
    theme(id: $themeId) {
      files(filenames: ["config/settings_data.json"], first: 1) {
        nodes {
          body {
            ... on OnlineStoreThemeFileBodyText {
              content
            }
          }
        }
      }
    }
  }`;