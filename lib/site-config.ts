export const siteConfig = {
  name: "Atlas Pokedex",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  legal: {
    publisherName: "Pohalyah",
    publisherStatus: "Editeur independant",
    publicationDirector: "Pohalyah",
    contactEmail: "pohalyah@gmail.com",
    postalAddress: "Oui c'est ca, rue des potiers, 40000",
    hostName: "Vercel",
    hostWebsite: "https://vercel.com",
    hostAddress: "Informations d hebergement a completer si necessaire"
  }
} as const;
