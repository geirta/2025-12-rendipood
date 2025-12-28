import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import english from "./i18n/english.json"
import estonian from "./i18n/estonian.json"

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: english
  },
  et: {
    translation: estonian
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: determineLanguage(),
    //lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  function determineLanguage() {
    const language = localStorage.getItem("language") || "et";
    if (!language || !Object.keys(resources).includes(language)) {
        return "et"
    }
    return language;
  }

  export default i18n;