(function () {
  const DATA_URL = "data/site.json";

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

  function showError(message) {
    const root = document.getElementById("app");
    if (!root) return;
    root.innerHTML = "";
    root.appendChild(el("div", "error-banner", message));
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

  function mediaPanel(imageUrl, altText) {
    const wrap = el("div", "split__media");
    if (imageUrl) {
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = altText || "";
      wrap.appendChild(img);
    } else {
      wrap.appendChild(el("div", "media-placeholder", "Image placeholder"));
    }
    return wrap;
  }

  function mungedEmailLabel(email) {
    if (!email || !email.user || !email.domain) return "Contact";
    return email.user + " at " + email.domain;
  }

  function assembleMailto(email) {
    if (!email || !email.user || !email.domain) return "";
    return "mailto:" + email.user + "@" + email.domain;
  }

  function renderNav(nav) {
    const mount = document.getElementById("nav");
    if (!mount || !nav) return;

    const header = el("nav", "site-nav");
    header.setAttribute("aria-label", "Primary");

    const brand = el("a", "site-nav__brand", nav.brand || "");
    brand.href = "#hero";
    header.appendChild(brand);

    const list = el("ul", "site-nav__links");
    (nav.links || []).forEach(function (link) {
      const li = document.createElement("li");
      const a = el("a", null, link.label);
      a.href = link.href;
      li.appendChild(a);
      list.appendChild(li);
    });
    header.appendChild(list);
    mount.appendChild(header);
  }

  function renderHero(hero, email) {
    const mount = document.getElementById("hero");
    if (!mount || !hero) return;

    const split = el("div", "split");

    const text = el("div", "split__panel split__panel--text");
    text.appendChild(el("h1", "hero-headline", hero.headline));
    text.appendChild(el("p", "hero-summary", hero.summary));

    const ctas = el("div", "cta-row");
    (hero.ctas || []).forEach(function (cta) {
      if (cta.type === "contact") {
        const btn = el("button", "btn btn--ghost", cta.label || "Contact Me");
        btn.type = "button";
        btn.setAttribute("aria-label", mungedEmailLabel(email));
        btn.addEventListener("click", function () {
          const href = assembleMailto(email);
          if (href) window.location.href = href;
        });
        ctas.appendChild(btn);
        return;
      }

      const a = el("a", cta.style === "ghost" ? "btn btn--ghost" : "btn", cta.label);
      a.href = cta.href || "#";
      if (cta.external) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      ctas.appendChild(a);
    });
    text.appendChild(ctas);
    split.appendChild(text);

    split.appendChild(mediaPanel(hero.imageUrl, hero.headline || "Hero photo"));
    mount.appendChild(split);
  }

  function renderAbout(about) {
    const mount = document.getElementById("about");
    if (!mount || !about) return;

    const split = el("div", "split split--about");

    split.appendChild(mediaPanel(about.imageUrl, about.heading || "About photo"));

    const text = el("div", "split__panel split__panel--text");
    text.appendChild(el("h2", "section-title", about.heading));
    if (about.subheading) {
      text.appendChild(el("p", "section-kicker", about.subheading));
    }

    const list = el("ul", "about-list");
    (about.highlights || []).forEach(function (item) {
      const li = document.createElement("li");
      li.className = "about-list__item";

      const emoji = el("span", "about-list__emoji", item.emoji || "");
      const label = el("span", "about-list__label", (item.label || "") + ":");
      const content = el("span", "about-list__text", item.text || "");

      li.appendChild(emoji);
      li.appendChild(document.createTextNode(" "));
      li.appendChild(label);
      li.appendChild(document.createTextNode(" "));
      li.appendChild(content);
      list.appendChild(li);
    });
    text.appendChild(list);

    split.appendChild(text);
    mount.appendChild(split);
  }

  function renderExperience(experience) {
    const mount = document.getElementById("experience");
    if (!mount || !experience) return;

    const section = el("div", "section-block");
    const header = el("div", "section-block__header");
    header.appendChild(el("h2", "section-title", experience.heading));
    if (experience.subheading) {
      header.appendChild(el("p", "section-block__subtitle", experience.subheading));
    }
    section.appendChild(header);

    const grid = el("div", "experience-grid");
    (experience.items || []).forEach(function (item) {
      const card = el("article", "experience-card");
      card.appendChild(el("h3", "experience-card__title", item.title));
      card.appendChild(el("p", "experience-card__org", item.org));
      card.appendChild(el("p", "experience-card__blurb", item.blurb));
      grid.appendChild(card);
    });
    section.appendChild(grid);
    mount.appendChild(section);
  }

  function renderEducation(education) {
    const mount = document.getElementById("education");
    if (!mount || !education) return;

    const section = el("div", "education");
    section.appendChild(el("h2", "section-title", education.heading));
    section.appendChild(el("hr", "education__rule"));

    const grid = el("div", "education-grid");
    (education.items || []).forEach(function (item) {
      const card = el("article", "education-item");
      const iconWrap = el("div", "education-item__icon");
      iconWrap.appendChild(icon("fas " + (item.icon || "fa-graduation-cap")));
      card.appendChild(iconWrap);
      card.appendChild(el("p", "education-item__label", item.label));
      card.appendChild(el("p", "education-item__detail", item.detail));
      grid.appendChild(card);
    });
    section.appendChild(grid);
    mount.appendChild(section);
  }

  function renderSkills(skills) {
    const mount = document.getElementById("skills");
    if (!mount || !skills) return;

    const section = el("div", "section-block");
    const header = el("div", "section-block__header");
    header.appendChild(el("h2", "section-title", skills.heading));
    if (skills.subheading) {
      header.appendChild(el("p", "section-block__subtitle", skills.subheading));
    }
    section.appendChild(header);

    const matrix = el("div", "skills-matrix");
    (skills.groups || []).forEach(function (group) {
      const groupEl = el("div", "skill-group");
      groupEl.appendChild(el("h3", "skill-group__title", group.category));
      const tags = el("div", "skill-tags");
      (group.tags || []).forEach(function (tag) {
        tags.appendChild(el("span", "skill-tag", tag));
      });
      groupEl.appendChild(tags);
      matrix.appendChild(groupEl);
    });
    section.appendChild(matrix);
    mount.appendChild(section);
  }

  function renderProjects(projects) {
    const mount = document.getElementById("projects");
    if (!mount || !projects) return;

    const section = el("div", "section-block");
    const header = el("div", "section-block__header");
    header.appendChild(el("h2", "section-title", projects.heading));
    if (projects.subheading) {
      header.appendChild(el("p", "section-block__subtitle", projects.subheading));
    }
    section.appendChild(header);

    const grid = el("div", "projects-grid");
    (projects.items || []).forEach(function (item) {
      const card = el("article", "project-card");
      card.appendChild(el("h3", "project-card__title", item.title));

      if (item.repoUrl) {
        const repo = el("a", "project-card__repo", item.repoLabel || item.repoUrl);
        repo.href = item.repoUrl;
        repo.target = "_blank";
        repo.rel = "noopener noreferrer";
        card.appendChild(repo);
      }

      card.appendChild(el("p", "project-card__label", "Problem"));
      card.appendChild(el("p", "project-card__text", item.problem));

      card.appendChild(el("p", "project-card__label", "System design"));
      card.appendChild(el("p", "project-card__text", item.systemDesign));

      card.appendChild(el("p", "project-card__label", "Tech stack"));
      const stack = el("ul", "project-card__stack");
      (item.techStack || []).forEach(function (tech) {
        stack.appendChild(el("li", null, tech));
      });
      card.appendChild(stack);

      card.appendChild(el("p", "project-card__label", "Outcome"));
      card.appendChild(el("p", "project-card__text", item.outcome));

      grid.appendChild(card);
    });
    section.appendChild(grid);
    mount.appendChild(section);
  }

  function renderFooter(footer) {
    const mount = document.getElementById("footer");
    if (!mount || !footer) return;

    const wrap = el("div", "site-footer");
    const p = el("p", null, null);
    p.appendChild(document.createTextNode("© "));
    p.appendChild(document.createTextNode(String(new Date().getFullYear())));
    p.appendChild(document.createTextNode(" " + (footer.copyrightName || "")));
    wrap.appendChild(p);
    mount.appendChild(wrap);
  }

  function render(data) {
    applyMeta(data.meta);
    renderNav(data.nav);
    renderHero(data.hero, data.email);
    renderAbout(data.about);
    renderExperience(data.experience);
    renderEducation(data.education);
    renderSkills(data.skills);
    renderProjects(data.projects);
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
