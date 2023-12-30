import Config from "../config/config";

// Define CSS variables for both light and dark themes
const lightTheme = {
  backgroundColor: "#aaa",
  backgroundColor1: "#fff",
  backgroundColor1: "#eee",
  textColor: "#333",
  borderColor: "rgba(0, 0, 0, 0.12)",
  hoverBackgroundColor: "#e0e0e0",
  transparentBackgroundColor: "transparent",
};

const darkTheme = {
  backgroundColor: "#888",
  backgroundColor1: "#333",
  backgroundColor3: "#aaa",
  textColor: "#ddd",
  borderColor: "rgba(255, 255, 255, 0.12)",
  hoverBackgroundColor: "#555",
  transparentBackgroundColor: "transparent",
};


const getThemeCss = (theme) => {
  return {
    content: () => Config.Css.css`
      margin: 0 auto;
      max-width: 920px;

      .plus4u5-app-about > .uu5-bricks-header,
      .plus4u5-app-licence > .uu5-bricks-header,
      .plus4u5-app-authors > .uu5-bricks-header,
      .plus4u5-app-technologies > .uu5-bricks-header {
        border-bottom: 0;
      }

      .plus4u5-app-authors > .uu5-bricks-header {
        margin: 20px 0 10px 0;
        text-align: center;
      }

      > *:last-child {
        padding-bottom: 56px;
      }
    `,
    technologies: () => Config.Css.css({ maxWidth: 480 }),
    logos: () => Config.Css.css({ textAlign: "center", marginTop: 56 }),
    common: () =>
      Config.Css.css({
        maxWidth: 480,
        margin: "12px auto 56px",

        "& > *": {
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
          padding: "9px 0 12px",
          textAlign: "center",
          color: theme.color,
          "&:last-child": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          },
        },
      }),
    listItem: () =>
      Config.Css.css({
        cursor: "pointer",
        "&:hover": {
          backgroundColor: theme.hoverBackgroundColor,
        },
      }),
    titleEdit: () =>
      Config.Css.css({
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "inherit",
        border: "none",
        outline: "none",
        padding: "0",
        margin: "19px 0 19px 0",
        backgroundColor: "transparent",
        width: "100%",
      }),
    divider: () =>
      Config.Css.css({
        height: "auto",
        alignSelf: "stretch",
        borderLeft: "1px dotted grey",
      }),
    titleContainer: () =>
      Config.Css.css({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 0 0 0",
      }),
    title: () =>
      Config.Css.css({
        color: theme.textColor,
      }),
    card: () =>
      Config.Css.css({
        "&:hover": {
          backgroundColor: theme.hoverBackgroundColor,
        },
        backgroundColor: theme.backgroundColor,
      }),
    cardAction: () =>
      Config.Css.css({
        backgroundColor: theme.backgroundColor3,
      }),
    sideCol: () =>
      Config.Css.css({
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }),
    centerCol: () =>
      Config.Css.css({
        backgroundColor: theme.backgroundColor1,
      }),
  };
};

const Css = {
  // Initial theme
  ...getThemeCss(lightTheme),
  // Method to switch themes
  switchTheme: (isDarkMode) => {
    const theme = isDarkMode ? darkTheme : lightTheme;
    Object.assign(Css, getThemeCss(theme));
    console.log("updared");
  },
};

export default Css;
