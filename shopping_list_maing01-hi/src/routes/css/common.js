import Config from "../config/config";


//@@viewOn:css
const Css = {
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
  technologies: () => Config.Css.css({maxWidth: 480}),
  logos: () => Config.Css.css({textAlign: "center", marginTop: 56}),
  common: () =>
    Config.Css.css({
      maxWidth: 480,
      margin: "12px auto 56px",

      "& > *": {
        borderTop: "1px solid rgba(0, 0, 0, 0.12)",
        padding: "9px 0 12px",
        textAlign: "center",
        color: "#828282",
        "&:last-child": {
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        },
      },
    }),
  listItem: () => Config.Css.css({
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#e0e0e0', // Change this color as needed
    }
  }),
  titleEdit: () => Config.Css.css({
    fontSize: '1.5rem', // Match the font size of h2
    fontWeight: 'bold',
    color: 'inherit',
    border: 'none',
    outline: 'none',
    padding: '0',
    margin: '19px 0 19px 0',
    backgroundColor: 'transparent', // Match the background of h2
    width: '100%' // Ensure it takes the full width
  }),
  divider: () => Config.Css.css({
    height: 'auto',
    alignSelf: 'stretch',
    borderLeft: '1px dotted grey' // Dotted grey line
  }),
  titleContainer: () => Config.Css.css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0 0 0' // Adjust padding as needed
  }),
};

//@@viewOff:css

export default Css;
