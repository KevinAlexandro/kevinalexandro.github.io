(function () {
  const DATA_URL = "data/site.json";

  const ACCENT_CLASSES = {
    yellow: {
      card: "bg-white text-gray-800 font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-between group border-2 border-transparent hover:border-yellow-400",
      iconWrap: "w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform",
      iconSize: "text-lg",
      labelClass: "text-lg",
      trailing: "fas fa-chevron-right text-gray-400",
    },
    purple: {
      card: "link-card bg-white/90 hover:bg-white text-gray-800 font-semibold py-3.5 px-6 rounded-xl shadow-md flex items-center justify-between group backdrop-blur-sm",
      iconWrap: "w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform accent-text",
      iconSize: "text-xl",
      labelClass: "",
      trailing: "fas fa-external-link-alt text-gray-400 text-sm",
    },
    green: {
      card: "link-card bg-white/90 hover:bg-white text-gray-800 font-semibold py-3.5 px-6 rounded-xl shadow-md flex items-center justify-between group backdrop-blur-sm",
      iconWrap: "w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform",
      iconSize: "text-xl",
      labelClass: "",
      trailing: "fas fa-external-link-alt text-gray-400 text-sm",
    },
    blue: {
      card: "link-card bg-white/90 hover:bg-white text-gray-800 font-semibold py-3.5 px-6 rounded-xl shadow-md flex items-center justify-between group backdrop-blur-sm",
      iconWrap: "w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform",
      iconSize: "text-xl",
      labelClass: "",
      trailing: "fas fa-external-link-alt text-gray-400 text-sm",
    },
    gray: {
      card: "link-card bg-white/90 hover:bg-white text-gray-800 font-semibold py-3.5 px-6 rounded-xl shadow-md flex items-center justify-between group backdrop-blur-sm",
      iconWrap: "w-10 h-10 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform",
      iconSize: "text-xl",
      labelClass: "",
      trailing: "fas fa-external-link-alt text-gray-400 text-sm",
    },
  };

  const DELAY_CLASS = {
    "0.6s": "delay-6",
    "0.65s": "delay-65",
    "0.7s": "delay-7",
    "0.75s": "delay-75",
    "0.8s": "delay-8",
  };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function icon(className) {
    const i = document.createElement("i");
    i.className = className;
    i.setAttribute("aria-hidden", "true");
    return i;
  }

  function bulletList(bullets) {
    const ul = el("ul", "text-sm text-gray-600 list-disc list-inside space-y-1");
    bullets.forEach(function (bullet) {
      ul.appendChild(el("li", null, bullet));
    });
    return ul;
  }

  function showError(message) {
    const root = document.getElementById("app");
    if (!root) return;
    root.innerHTML = "";
    const banner = el("div", "error-banner", message);
    root.appendChild(banner);
  }

  function applyMeta(meta) {
    if (!meta) return;
    if (meta.title) document.title = meta.title;
    if (meta.description) {
      let description = document.querySelector('meta[name="description"]');
      if (!description) {
        description = document.createElement("meta");
        description.setAttribute("name", "description");
        document.head.appendChild(description);
      }
      description.setAttribute("content", meta.description);
    }
  }

  function renderHero(data) {
    const mount = document.getElementById("hero");
    if (!mount || !data) return;

    const avatarWrap = el("div", "relative mx-auto w-32 h-32 mb-4");
    const img = document.createElement("img");
    img.src = data.avatarUrl;
    img.alt = data.avatarAlt || data.name || "";
    img.className = "w-full h-full rounded-full object-cover border-4 border-white/30 backdrop-shadow";
    avatarWrap.appendChild(img);

    const location = el("div", "inline-block bg-white/20 rounded-full px-4 py-1 backdrop-blur-sm");
    const locationText = el("p", "text-white text-sm font-semibold");
    locationText.appendChild(icon("fas fa-map-marker-alt mr-1"));
    locationText.appendChild(document.createTextNode(" " + data.location));
    location.appendChild(locationText);

    mount.appendChild(avatarWrap);
    mount.appendChild(el("h1", "text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-md tracking-wide", data.name));
    mount.appendChild(el("p", "text-white/90 text-lg sm:text-xl font-light mb-2", data.tagline));
    mount.appendChild(location);
  }

  function renderProfile(data) {
    const mount = document.getElementById("profile");
    if (!mount || !data) return;
    mount.appendChild(el("h2", "text-2xl font-bold section-heading mb-3", data.heading));
    mount.appendChild(el("p", "text-gray-700 leading-relaxed", data.body));
  }

  function renderExperience(items) {
    const mount = document.getElementById("experience");
    if (!mount || !items) return;

    mount.appendChild(el("h2", "text-2xl font-bold text-white mb-4 drop-shadow-md", "Experience"));

    items.forEach(function (item) {
      const card = el("div", "glass-card rounded-xl p-5 mb-4 shadow-lg");
      const header = el("div", "flex flex-wrap justify-between gap-2 mb-2");
      header.appendChild(el("h3", "font-bold text-gray-900", item.title));
      header.appendChild(el("span", "text-sm text-gray-500", item.dates));
      card.appendChild(header);
      card.appendChild(el("p", "text-sm font-semibold mb-2 accent-text", item.org));
      card.appendChild(bulletList(item.bullets || []));
      mount.appendChild(card);
    });
  }

  function renderProjects(items) {
    const mount = document.getElementById("projects");
    if (!mount || !items) return;

    mount.appendChild(el("h2", "text-2xl font-bold text-white mb-4 drop-shadow-md", "Projects"));

    items.forEach(function (item) {
      const card = el("div", "glass-card rounded-xl p-5 mb-4 shadow-lg");
      const header = el("div", "flex flex-wrap justify-between gap-2 mb-2");
      header.appendChild(el("h3", "font-bold text-gray-900", item.title));
      header.appendChild(el("span", "text-sm text-gray-500", item.dates));
      card.appendChild(header);

      if (item.repoUrl) {
        const link = document.createElement("a");
        link.href = item.repoUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className = "text-sm font-semibold hover:underline accent-text";
        link.appendChild(icon("fab fa-github mr-1"));
        link.appendChild(document.createTextNode(" " + (item.repoLabel || item.repoUrl)));
        card.appendChild(link);
      }

      const list = bulletList(item.bullets || []);
      list.classList.add("mt-2");
      card.appendChild(list);
      mount.appendChild(card);
    });
  }

  function renderSkills(groups) {
    const mount = document.getElementById("skills");
    if (!mount || !groups) return;

    mount.appendChild(el("h2", "text-2xl font-bold section-heading mb-4", "Skills"));

    groups.forEach(function (group, index) {
      mount.appendChild(el("h3", "text-sm font-bold text-gray-800 mb-2", group.category));
      const tagsWrap = el("div", index === groups.length - 1 ? "" : "mb-4");
      (group.tags || []).forEach(function (tag) {
        tagsWrap.appendChild(el("span", "skill-tag", tag));
      });
      mount.appendChild(tagsWrap);
    });
  }

  function renderConnect(connect) {
    const mount = document.getElementById("connect");
    if (!mount || !connect) return;

    mount.appendChild(el("h3", "text-white text-center text-lg font-bold mb-4 uppercase tracking-widest opacity-80", connect.heading || "Connect With Me"));

    const list = el("div", "space-y-4 w-full max-w-md mx-auto px-2 mb-12");

    (connect.items || []).forEach(function (item) {
      const accent = ACCENT_CLASSES[item.accent] || ACCENT_CLASSES.gray;
      const delayClass = DELAY_CLASS[item.animationDelay] || "";

      const anchor = document.createElement("a");
      anchor.href = item.href;
      anchor.className = ("fade-in block " + delayClass).trim();
      if (item.external) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }

      const card = el("div", item.accent === "yellow" ? "link-card " + accent.card : accent.card);
      const left = el("div", "flex items-center");
      const iconWrap = el("div", accent.iconWrap);
      iconWrap.appendChild(icon(item.icon + " " + accent.iconSize));
      left.appendChild(iconWrap);
      left.appendChild(el("span", accent.labelClass, item.label));

      card.appendChild(left);
      card.appendChild(icon(accent.trailing));
      anchor.appendChild(card);
      list.appendChild(anchor);
    });

    mount.appendChild(list);
  }

  function renderFooter(footer) {
    const mount = document.getElementById("footer");
    if (!mount || !footer) return;

    const p = el("p", "text-white/80 text-xs");
    p.appendChild(document.createTextNode("© "));
    const year = el("span", null, String(new Date().getFullYear()));
    year.id = "year";
    p.appendChild(year);
    p.appendChild(document.createTextNode(" " + (footer.copyrightName || "")));
    mount.appendChild(p);
  }

  function render(data) {
    applyMeta(data.meta);
    renderHero(data.hero);
    renderProfile(data.profile);
    renderExperience(data.experience);
    renderProjects(data.projects);
    renderSkills(data.skills);
    renderConnect(data.connect);
    renderFooter(data.footer);
  }

  fetch(DATA_URL)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load site data (" + response.status + ")");
      }
      return response.json();
    })
    .then(render)
    .catch(function (error) {
      console.error(error);
      showError("Unable to load site content. Please try again later.");
    });
})();
