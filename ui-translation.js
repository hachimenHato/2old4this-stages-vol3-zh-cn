const SOURCE_MODULE_ID = "2old4this-stages-vol3";
const MODULE_TITLE_EN = "2old4this Stages Vol.3";
const MODULE_TITLE_ZH = "2old4this 舞台 Vol.3";

const CATEGORY_TRANSLATIONS = new Map([
  ["Backgrounds", "背景"],
  ["Characters", "角色"],
  ["Floors", "地板"],
  ["Monsters", "怪物"],
  ["Extras", "附加素材"],
]);

const FILTER_TRANSLATIONS = new Map([
  ["Gateway", "入口"],
  ["Pathway", "通道"],
  ["Room", "房间"],
  ["Stairs", "楼梯"],
  ["Exterior", "外景"],
  ["Interior", "内景"],
  ["Aley", "巷道"],
  ["Industrial", "工业区"],
  ["Market", "市集"],
  ["Public", "公共区域"],
  ["Residence", "住宅"],
  ["Road", "道路"],
  ["Workshop", "工坊"],
  ["Dask or Dawn", "黄昏或黎明"],
  ["Day", "白昼"],
  ["Night", "夜晚"],
  ["Crystal", "水晶"],
  ["Ice", "冰雪"],
  ["Lava", "熔岩"],
  ["Rock", "岩石"],
  ["Roots", "根系"],
  ["Rumbles", "震动"],
  ["Water", "水域"],
  ["Outskirts", "郊野"],
  ["Village", "村落"],
  ["Farming", "农田"],
  ["Ruins", "遗迹"],
  ["Resource", "资源"],
  ["Hazard", "险地"],
  ["Microclimate", "微气候"],
  ["Haven", "庇护地"],
  ["Obstacle", "障碍"],
  ["Male", "男性"],
  ["Female", "女性"],
  ["Young", "青年"],
  ["Elder", "老年"],
  ["Adult", "成年"],
  ["Hands", "手部"],
  ["Limps", "跛行"],
  ["Walking", "步行"],
  ["Flying", "飞行"],
]);

const DASHBOARD_TEXT = new Map([
  ...CATEGORY_TRANSLATIONS,
  ...FILTER_TRANSLATIONS,
  ["Token Manipulator", "指示物调整器"],
  ["Prep Tokens", "整备指示物"],
  ["Auto-Sort Tokens", "自动层级排序"],
  ["🟢 Show All", "🟢 显示全部"],
  ["🟢 Show All Images", "🟢 显示全部图片"],
]);

const DASHBOARD_TITLES = new Map([
  ["Open Manipulator HUD", "打开指示物调整器"],
  ["Format to 3x1 and anchor", "调整为 3×1 并设置锚点"],
  ["Auto-sort Y depth", "按纵向位置自动排列层级"],
  ["Feel Lucky — pick a random background!", "碰碰运气——随机选择一个背景！"],
  ["Manage Custom Keywords", "管理自定义关键词"],
  ["Rescan asset folders", "重新扫描素材文件夹"],
  ["Default Theater Frame", "默认剧场边框"],
  ["Default Wooden Floor", "默认木质地板"],
]);

const TOKEN_TEXT = new Map([
  ["Select a token to begin...", "请先选择一个指示物……"],
  ["Width:", "宽度："],
  ["Height:", "高度："],
  ["Manual Scale:", "手动缩放："],
  ["Reset Tint", "清除着色"],
]);

const TOKEN_TITLES = new Map([
  ["-1 Width", "宽度减 1"],
  ["+1 Width", "宽度加 1"],
  ["-1 Height", "高度减 1"],
  ["+1 Height", "高度加 1"],
  ["-0.2 Scale", "缩小 0.2"],
  ["+0.2 Scale", "放大 0.2"],
  ["Flip Horizontal", "水平翻转"],
  ["Anchor Y Down by 0.05", "纵向锚点下移 0.05"],
  ["Anchor Y Up by 0.05", "纵向锚点上移 0.05"],
]);

const KEYWORD_TEXT = new Map([
  ["Tip:", "提示："],
  ["Add a unique part of your custom image filename (e.g.,", "请添加自定义图片文件名中具有辨识度的一段文字（例如"],
  ["). The gallery will automatically ignore capitals and underscores!", "）。图库匹配时会自动忽略大小写与下划线！"],
  ["Add New Keyword", "添加新关键词"],
  ["Your Keywords", "已添加的关键词"],
  ["No custom keywords added yet.", "尚未添加自定义关键词。"],
  ["Done", "完成"],
]);

const CHECKER_TEXT = new Map([
  ["ok", "正常"],
  ["created", "已创建"],
  ["error", "错误"],
  ["Re-check", "重新检查"],
  ["Done", "完成"],
]);

const SETTINGS_TEXT = new Map([
  [MODULE_TITLE_EN, MODULE_TITLE_ZH],
  ["Show Update Notes", "显示更新说明"],
  ["Automatically open the documentation journal when the module updates to a new version.", "模组更新到新版本时，自动打开说明日志。"],
  ["Asset Folder Check & Repair", "检查并修复素材文件夹"],
  ["🔍 Check & Repair Folders", "🔍 检查并修复文件夹"],
  ["Manually verify the external asset folder structure. Creates any missing folders and reports the results.", "手动检查外部素材文件夹结构，自动创建缺失的文件夹并报告结果。"],
]);

const MODULE_DESCRIPTION_EN = "A module designed to elevate the Theater of the Mind through immersive scene presentations and retro pixel art aesthetics. Featuring an integrated Next-Gen Dashboard, easy-to-use automations, pre-made scenes, and powerful stage controls.";
const MODULE_DESCRIPTION_ZH = "以沉浸式场景演出与复古像素美术，为“心灵剧场”赋予更鲜活的表现力。内置新一代控制台、易用的自动化工具、预制场景和强大的舞台控制功能。";

const observedRoots = new WeakMap();

function isChinese() {
  return game?.i18n?.lang === "cn";
}

function getRoot(app, html, id) {
  const byId = id ? document.getElementById(id) : null;
  if (byId) return byId;

  const element = html instanceof HTMLElement ? html : html?.[0];
  return element?.closest?.(".application") ?? element ?? app?.element?.[0] ?? app?.element ?? null;
}

function replaceTrimmed(text, translations) {
  const core = text.trim();
  const translated = translations.get(core);
  if (!translated) return text;

  const start = text.indexOf(core);
  return `${text.slice(0, start)}${translated}${text.slice(start + core.length)}`;
}

function translateTextNodes(root, translator) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  for (const node of nodes) {
    if (["SCRIPT", "STYLE", "TEXTAREA"].includes(node.parentElement?.tagName)) continue;
    const translated = translator(node.nodeValue ?? "");
    if (translated !== node.nodeValue) node.nodeValue = translated;
  }
}

function setButtonLabel(button, label) {
  if (!button) return;
  const textNodes = [...button.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE);
  if (!textNodes.length) {
    button.append(document.createTextNode(`${button.children.length ? " " : ""}${label}`));
    return;
  }

  textNodes[0].nodeValue = `${button.children.length ? " " : ""}${label}`;
  for (const extra of textNodes.slice(1)) extra.nodeValue = "";
}

function translateTitleAttributes(root, translations) {
  for (const element of root?.querySelectorAll?.("[title]") ?? []) {
    const translated = translations.get(element.title);
    if (translated) element.title = translated;
  }
}

function observe(root, localizer) {
  if (!root || observedRoots.has(root)) return;
  const observer = new MutationObserver(() => localizer(root));
  observer.observe(root, { childList: true, subtree: true, characterData: true });
  observedRoots.set(root, observer);
}

function localizeWindowTitle(root, source, translation) {
  const title = root?.querySelector?.(".window-title");
  if (title?.textContent.trim() === source) title.textContent = translation;
}

function localizeDashboard(root) {
  if (!root || !isChinese()) return;
  localizeWindowTitle(root, "2OLD4THIS STAGES HUB", "2OLD4THIS 舞台控制台");
  translateTextNodes(root, (text) => replaceTrimmed(text, DASHBOARD_TEXT));
  translateTitleAttributes(root, DASHBOARD_TITLES);
  observe(root, localizeDashboard);
}

function localizeTokenManipulator(root) {
  if (!root || !isChinese()) return;
  localizeWindowTitle(root, "Global Token Manipulator", "全局指示物调整器");
  translateTextNodes(root, (text) => replaceTrimmed(text, TOKEN_TEXT));
  translateTitleAttributes(root, TOKEN_TITLES);

  const legends = root.querySelectorAll(".old4this-tm-wrapper fieldset legend strong");
  if (legends[0]) {
    const match = legends[0].textContent.match(/^Grid Size \(Current: ([^)]+)\)( \(Primary\))?$/);
    if (match) legends[0].textContent = `网格尺寸（当前：${match[1].replace("x", "×")}）${match[2] ? "（主选）" : ""}`;
  }
  if (legends[1]) {
    const match = legends[1].textContent.match(/^Visual Scale( \(Primary\))?$/);
    if (match) legends[1].textContent = `视觉缩放${match[1] ? "（主选）" : ""}`;
  }
  if (legends[2]) {
    const match = legends[2].textContent.match(/^Anchor Y \(Current: ([^)]+)\)( \(Primary\))?$/);
    if (match) legends[2].textContent = `纵向锚点（当前：${match[1]}）${match[2] ? "（主选）" : ""}`;
  }
  if (legends[3] && legends[3].textContent.startsWith("Tint Color (Current:")) {
    const textNodes = [...legends[3].childNodes].filter((node) => node.nodeType === Node.TEXT_NODE);
    if (textNodes[0]) textNodes[0].nodeValue = "着色（当前：";
    if (textNodes[1]) textNodes[1].nodeValue = textNodes[1].nodeValue.includes("Primary") ? "）（主选）" : "）";
  }

  observe(root, localizeTokenManipulator);
}

function checkerTranslator(text) {
  const exact = replaceTrimmed(text, CHECKER_TEXT);
  if (exact !== text) return exact;

  const core = text.trim();
  let translated = core;
  let match;
  if ((match = core.match(/^(\d+) folder\(s\) could not be created\. Check permissions\.$/))) {
    translated = `有 ${match[1]} 个文件夹无法创建，请检查权限。`;
  } else if ((match = core.match(/^Repaired! Created (\d+) missing folder\(s\)\.$/))) {
    translated = `修复完成！已创建 ${match[1]} 个缺失的文件夹。`;
  } else if ((match = core.match(/^All (\d+) folders are present\. Everything looks good!$/))) {
    translated = `所需的 ${match[1]} 个文件夹均已就位，一切正常！`;
  } else if ((match = core.match(/^✅\s*(\d+) existing\s*·\s*🔧\s*(\d+) created\s*·\s*❌\s*(\d+) errors\s*·\s*Total:\s*(\d+)$/))) {
    translated = `✅ ${match[1]} 个原有　·　🔧 ${match[2]} 个新建　·　❌ ${match[3]} 个错误　·　共 ${match[4]} 个`;
  }

  if (translated === core) return text;
  return text.replace(core, translated);
}

function localizeFolderChecker(root) {
  if (!root || !isChinese()) return;
  localizeWindowTitle(root, "2OLD4THIS — Asset Folder Check", "2OLD4THIS — 素材文件夹检查");
  translateTextNodes(root, checkerTranslator);
  observe(root, localizeFolderChecker);
}

function localizeKeywordDialog(root) {
  if (!root || !isChinese()) return;
  localizeWindowTitle(root, "Manage Custom Keywords", "管理自定义关键词");
  translateTextNodes(root, (text) => replaceTrimmed(text, KEYWORD_TEXT));

  const input = root.querySelector("#new-kw-input");
  if (input?.placeholder === "e.g. Dark Cave") input.placeholder = "例如：Dark Cave";
  translateTitleAttributes(root, new Map([["Delete Keyword", "删除关键词"]]));
  observe(root, localizeKeywordDialog);
}

function localizeSettingsRegistry() {
  if (!isChinese()) return;
  try {
    const setting = game.settings.settings.get(`${SOURCE_MODULE_ID}.showUpdateNotes`);
    if (setting) {
      setting.name = "显示更新说明";
      setting.hint = "模组更新到新版本时，自动打开说明日志。";
    }

    const menu = game.settings.menus.get(`${SOURCE_MODULE_ID}.folderCheckerMenu`);
    if (menu) {
      menu.name = "检查并修复素材文件夹";
      menu.label = "🔍 检查并修复文件夹";
      menu.hint = "手动检查外部素材文件夹结构，自动创建缺失的文件夹并报告结果。";
    }
  } catch (error) {
    console.warn("2old4this Stages Vol.3 简体中文汉化 | 无法更新设置项的显示文本", error);
  }
}

function localizeSettings(root) {
  if (!root || !isChinese()) return;
  translateTextNodes(root, (text) => replaceTrimmed(text, SETTINGS_TEXT));
}

function localizeModuleManagement(root) {
  if (!root || !isChinese()) return;
  const translations = new Map([
    [MODULE_TITLE_EN, MODULE_TITLE_ZH],
    [MODULE_DESCRIPTION_EN, MODULE_DESCRIPTION_ZH],
  ]);
  translateTextNodes(root, (text) => replaceTrimmed(text, translations));
}

function notificationTranslator(text) {
  const core = text.trim();
  const exact = new Map([
    ["2OLD4THIS: Asset gallery refreshed!", "2OLD4THIS：素材图库已刷新！"],
    ["2OLD4THIS: No images available to pick from! Select a pack first.", "2OLD4THIS：当前没有可供随机挑选的图片，请先选择一个素材包。"],
    ["2old4this: No scene is currently active!", "2old4this：当前没有激活的场景！"],
    ["2old4this: Stage background updated!", "2old4this：舞台背景已更新！"],
    ["2old4this: Stage tile not found! Check your dimensions (2200x900), coordinates (X:1150, Y:850), and elevation/sort (-28).", "2old4this：未找到舞台背景图块！请检查尺寸（2200×900）、坐标（X:1150，Y:850）以及高度／排序值（-28）。"],
    ["2old4this: Floor tile updated!", "2old4this：地板图块已更新！"],
    ["2old4this: Floor tile not found! Check your dimensions (2987x416), coordinates (X:800, Y:1750), and elevation/sort (-26).", "2old4this：未找到地板图块！请检查尺寸（2987×416）、坐标（X:800，Y:1750）以及高度／排序值（-26）。"],
    ["2old4this: Select a token first!", "2old4this：请先选择一个指示物！"],
    ["2OLD4THIS: Checking asset folders...", "2OLD4THIS：正在检查素材文件夹……"],
    ["2OLD4THIS: Re-check complete!", "2OLD4THIS：重新检查完成！"],
    ["2OLD4THIS: Setting up asset folders. Please wait...", "2OLD4THIS：正在建立素材文件夹，请稍候……"],
    ["2OLD4THIS: Asset folders ready! Drop your Patreon downloads into '2old4this_assets'.", "2OLD4THIS：素材文件夹已准备就绪！请将从 Patreon 下载的内容放入“2old4this_assets”。"],
    ["2old4this Stages Vol.3 is ready!", "2old4this 舞台 Vol.3 已就绪！"],
    ["2old4this: No tokens selected for prep!", "2old4this：尚未选择要整备的指示物！"],
    ["2old4this: Auto-Sort disabled.", "2old4this：自动层级排序已关闭。"],
    ["2old4this: Auto-Sort enabled. Tokens will sort automatically on move.", "2old4this：自动层级排序已开启；指示物移动时会自动更新层级。"],
  ]).get(core);
  if (exact) return text.replace(core, exact);

  let match;
  let translated = core;
  if ((match = core.match(/^2old4this: Updated artwork for (\d+) character\(s\)!$/))) {
    translated = `2old4this：已更新 ${match[1]} 个角色的图像！`;
  } else if ((match = core.match(/^2old4this: Failed to update artwork: (.+)$/))) {
    translated = `2old4this：更新图像失败：${match[1]}`;
  } else if ((match = core.match(/^The keyword "(.+)" is already in your list!$/))) {
    translated = `关键词“${match[1]}”已在列表中！`;
  } else if ((match = core.match(/^2old4this: Prepped (\d+) tokens?$/))) {
    translated = `2old4this：已整备 ${match[1]} 个指示物。`;
  } else if ((match = core.match(/^2old4this: Updated Sort values for (\d+) tokens\.$/))) {
    translated = `2old4this：已更新 ${match[1]} 个指示物的层级排序值。`;
  }

  return translated === core ? text : text.replace(core, translated);
}

function localizeNotifications(root) {
  if (!root || !isChinese()) return;
  translateTextNodes(root, notificationTranslator);
}

async function localizeAssetConfiguration() {
  if (!isChinese()) return;
  try {
    const { CATEGORIES, PACK_FILTERS } = await import("../2old4this-stages-vol3/scripts/app/assetConfig.js");
    for (const category of CATEGORIES) {
      category.name = CATEGORY_TRANSLATIONS.get(category.name) ?? category.name;
    }
    for (const rule of PACK_FILTERS) {
      for (const filter of rule.filters) {
        filter.label = FILTER_TRANSLATIONS.get(filter.label) ?? filter.label;
      }
    }
  } catch (error) {
    console.warn("2old4this Stages Vol.3 简体中文汉化 | 无法载入界面标签", error);
  }
}

Hooks.once("init", localizeAssetConfiguration);

Hooks.on("getSceneControlButtons", (controls) => {
  if (!isChinese()) return;
  const tool = controls?.tokens?.tools?.["2old4this-stages"];
  if (tool) tool.title = "2old4this 舞台控制台";
});

Hooks.on("renderSceneControls", (app, html) => {
  if (!isChinese()) return;
  const root = getRoot(app, html);
  translateTitleAttributes(root, new Map([["2old4this Stages Hub", "2old4this 舞台控制台"]]));
});

Hooks.on("renderStagesDashboard", (app, html) => {
  localizeDashboard(getRoot(app, html, "2old4this-stages-dashboard"));
});

Hooks.on("renderGlobalTokenManipulator", (app, html) => {
  localizeTokenManipulator(getRoot(app, html, "global-token-manipulator"));
});

Hooks.on("renderAssetFolderChecker", (app, html) => {
  localizeFolderChecker(getRoot(app, html, "2old4this-folder-checker"));
});

Hooks.on("renderDialog", (app, html) => {
  if (app?.title !== "Manage Custom Keywords") return;
  localizeKeywordDialog(getRoot(app, html));
});

Hooks.on("renderSettingsConfig", (app, html) => {
  localizeSettings(getRoot(app, html));
});

Hooks.on("renderModuleManagement", (app, html) => {
  localizeModuleManagement(getRoot(app, html));
});

Hooks.once("ready", () => {
  localizeSettingsRegistry();

  const notificationRoot = document.getElementById("notifications");
  if (notificationRoot) {
    localizeNotifications(notificationRoot);
    observe(notificationRoot, localizeNotifications);
  }
});
