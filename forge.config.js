module.exports = {
  packagerConfig: {
    name: "Scientific Calculator",
    executableName: "scientific_calculator",
    icon: "./assets/icon",
    asar: true,
  },
  makers: [
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          maintainer: "Md. Shahriyar Rahim",
          homepage: "https://github.com/Shahriyar-Rahim",
          icon: "./assets/icon.png",
          categories: ["Utility", "Education", "Science"],
          section: "utils",
          priority: "optional",
        },
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["linux"],
    },
  ],
};
