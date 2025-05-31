export const getLanguageId = (lang) => {
  const languageMap = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
  };

  return languageMap[lang.toUpperCase()];
};
