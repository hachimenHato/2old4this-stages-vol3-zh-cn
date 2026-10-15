const MODULE_ID = "2old4this-stages-vol3-zh-cn";

Hooks.once("babele.init", (babele) => {
  babele.register({
    module: MODULE_ID,
    lang: "cn",
    dir: "compendium/cn",
  });
});
