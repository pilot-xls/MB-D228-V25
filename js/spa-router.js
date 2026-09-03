// spa-router.js
// Navegação instantânea entre as páginas partilhadas pelo footer
// (Calculadora, W&B, Rotas) sem recarregar o documento inteiro.
//
// Cada página só carrega e executa os seus scripts UMA vez por sessão
// (várias delas têm "const"/"let" e listeners globais de topo, pelo
// que reexecutar o script partiria a página). Ao navegar, escondemos
// a vista atual e mostramos (ou construímos, na primeira visita) a
// vista de destino, mantendo o header/footer sempre montados.
//
// Home (index.html) e o link do WhatsApp ficam de fora de propósito:
// a estrutura da index.html não partilha o mesmo layout header/footer.
(function () {
    const SPA_PAGES = ['calculadora.html', 'mb.html', 'rotas.html'];
    const COMMON_CSS = ['css/theme.css', 'css/menu.css'];

    const views = Object.create(null);
    const loadedScripts = new Set();
    let currentPage = currentFileName();

    // Algumas páginas inserem modais/elementos diretamente em document.body
    // (em vez de dentro do seu próprio contentor). Como o body passa a poder
    // ter o conteúdo de várias páginas ao mesmo tempo (escondido/mostrado),
    // esses scripts têm de usar window.__spaActiveContainer em vez de
    // document.body diretamente, para ficarem escondidos/mostrados como
    // parte da página a que pertencem. Isto corre já aqui (síncrono, antes
    // de qualquer script da própria página), para valer também na página
    // carregada diretamente (não só nas construídas por SPA em buildView).
    window.__spaActiveContainer = document.getElementById('spa-view') || null;

    function currentFileName() {
        return location.pathname.split('/').pop() || 'index.html';
    }

    function normalizeHref(href) {
        try {
            return new URL(href, location.href).pathname.split('/').pop();
        } catch (e) {
            return href;
        }
    }

    function init() {
        const viewEl = document.getElementById('spa-view');
        if (!viewEl || SPA_PAGES.indexOf(currentPage) === -1) return;

        // Regista as folhas de estilo específicas desta página já presentes no <head>.
        Array.prototype.forEach.call(document.querySelectorAll('link[rel="stylesheet"]'), (link) => {
            const href = link.getAttribute('href');
            if (!href) return;
            const isCommon = COMMON_CSS.some((c) => normalizeHref(c) === normalizeHref(href));
            if (!isCommon) link.dataset.spaOwner = currentPage;
        });

        views[currentPage] = { el: viewEl, title: document.title };

        const footer = document.getElementById('footer');
        if (footer) {
            footer.addEventListener('click', onFooterClick);
        }

        window.addEventListener('popstate', () => {
            const target = currentFileName();
            if (target === currentPage) return;
            if (views[target]) {
                document.title = views[target].title || document.title;
                applyView(target);
            } else if (SPA_PAGES.indexOf(target) !== -1) {
                // Nunca visitada nesta sessão (ex.: recuou para lá de outra forma) — recarrega normalmente.
                location.reload();
            }
        });
    }

    function onFooterClick(e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const link = e.target.closest('a.footer-nav__item');
        if (!link || link.target === '_blank') return;

        const href = link.getAttribute('href') || '';
        const target = normalizeHref(href);
        if (SPA_PAGES.indexOf(target) === -1) return; // home / whatsapp -> navegação normal

        e.preventDefault();

        if (target === currentPage) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        navigateTo(target);
    }

    async function navigateTo(target) {
        try {
            // Atualiza o URL ANTES de correr os scripts da página de destino: o
            // rotas.js, por exemplo, só inicializa se location.pathname já
            // apontar para rotas.html — se só mudássemos o URL depois (como
            // acontecia antes), essa verificação falhava e a página ficava
            // com os dados por preencher.
            history.pushState({ page: target }, '', target);

            if (!views[target]) {
                await buildView(target);
            } else {
                document.title = views[target].title || document.title;
            }

            applyView(target);
        } catch (err) {
            console.warn('[spa-router] falha na navegação rápida, a recarregar normalmente:', err);
            location.href = target;
        }
    }

    async function buildView(target) {
        const res = await fetch(target, { cache: 'default' });
        if (!res.ok) throw new Error('HTTP ' + res.status + ' ao obter ' + target);

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const remoteView = doc.getElementById('spa-view');
        if (!remoteView) throw new Error('spa-view não encontrado em ' + target);

        // Também aqui, antes de correr os scripts da página (ver comentário em navigateTo).
        document.title = doc.title;

        // Para cada folha de estilo específica da página, registamos também se vem antes
        // ou depois de menu.css no <head> de origem: isso importa porque, em caso de empate
        // de especificidade, quem vier depois no cascade vence — e o layout de rotas.css
        // depende explicitamente de vir antes de menu.css (ver comentário em rotas.css junto
        // a .toolbar-rotas). Limitarmo-nos a acrescentar tudo ao fundo do <head> inverteria
        // essa ordem depois de visitar outra página SPA primeiro.
        const menuCssIndex = Array.prototype.findIndex.call(
            doc.querySelectorAll('link[rel="stylesheet"]'),
            (l) => normalizeHref(l.getAttribute('href')) === normalizeHref('css/menu.css')
        );

        const cssHrefs = [];
        Array.prototype.forEach.call(doc.querySelectorAll('link[rel="stylesheet"]'), (link, index) => {
            const href = link.getAttribute('href');
            if (!href) return;
            const isCommon = COMMON_CSS.some((c) => normalizeHref(c) === normalizeHref(href));
            if (!isCommon) cssHrefs.push({ href, beforeMenu: menuCssIndex === -1 ? true : index < menuCssIndex });
        });

        await Promise.all(cssHrefs.map(({ href, beforeMenu }) => ensureCssLoaded(href, target, beforeMenu)));

        const container = document.createElement('main');
        container.className = remoteView.className;
        container.setAttribute('data-spa-page', target);
        container.innerHTML = remoteView.innerHTML;
        container.hidden = true;

        const anchor = document.getElementById('spa-view');
        anchor.insertAdjacentElement('afterend', container);

        // A partir daqui, qualquer modal/elemento que os scripts desta página
        // insiram em "document.body" (em vez do seu próprio contentor) deve
        // usar window.__spaActiveContainer, para ficar dentro da vista e ser
        // escondido/mostrado junto com o resto da página.
        window.__spaActiveContainer = container;

        const scriptEls = Array.prototype.filter.call(
            doc.querySelectorAll('script[src]'),
            (s) => !/(^|\/)general\.js$|(^|\/)spa-router\.js$/.test(s.getAttribute('src') || '')
        );

        for (const scriptEl of scriptEls) {
            // Scripts com fallback onerror (ex.: html2canvas via CDN) são "melhor esforço":
            // não têm de bloquear a navegação nem os scripts seguintes (tal como o atributo
            // "defer" original já não impedia o resto da página de funcionar sem eles).
            if (scriptEl.hasAttribute('onerror')) {
                loadScriptOnce(scriptEl).catch(() => {});
            } else {
                await loadScriptOnce(scriptEl);
            }
        }

        views[target] = { el: container, title: doc.title };
    }

    function ensureCssLoaded(href, owner, beforeMenu) {
        const norm = normalizeHref(href);
        const existing = Array.prototype.find.call(
            document.querySelectorAll('link[rel="stylesheet"]'),
            (l) => normalizeHref(l.getAttribute('href')) === norm
        );
        if (existing) {
            existing.dataset.spaOwner = owner;
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.dataset.spaOwner = owner;

            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                resolve();
            };
            link.onload = finish;
            link.onerror = finish;
            setTimeout(finish, 1500);

            const menuLink = Array.prototype.find.call(
                document.querySelectorAll('link[rel="stylesheet"]'),
                (l) => normalizeHref(l.getAttribute('href')) === normalizeHref('css/menu.css')
            );
            if (menuLink && beforeMenu) {
                menuLink.insertAdjacentElement('beforebegin', link);
            } else if (menuLink) {
                menuLink.insertAdjacentElement('afterend', link);
            } else {
                document.head.appendChild(link);
            }
        });
    }

    function loadScriptOnce(sourceEl) {
        const src = sourceEl.getAttribute('src');
        if (!src || loadedScripts.has(src)) return Promise.resolve();
        loadedScripts.add(src);

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;

            if (sourceEl.getAttribute('type')) {
                script.type = sourceEl.getAttribute('type');
            }

            if (sourceEl.hasAttribute('onerror')) {
                // Best-effort (ex.: html2canvas via CDN): "async" para que, ao nível do
                // browser, não bloqueie a execução dos scripts seguintes enquanto esperamos
                // pelo fallback (script.async=false força ordem estrita de execução, o que
                // faria mb.js esperar pelo html2canvas mesmo sem estarmos a fazer await nisso).
                script.async = true;
                // Replica o fallback do html2canvas (CDN) sem usar eval do atributo inline.
                script.onerror = () => {
                    script.onerror = () => resolve();
                    script.onload = () => resolve();
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                };
                script.onload = () => resolve();
                setTimeout(resolve, 5000);
            } else {
                script.async = false; // preserva a ordem original de execução
                script.onerror = (e) => {
                    loadedScripts.delete(src);
                    reject(e);
                };
                script.onload = () => resolve();
            }

            document.body.appendChild(script);
        });
    }

    function updateFooterActive(target) {
        const footer = document.getElementById('footer');
        if (!footer) return;
        Array.prototype.forEach.call(footer.querySelectorAll('.footer-nav__item'), (el) => {
            el.classList.toggle('active', el.getAttribute('href') === target);
        });
    }

    function updatePageCss(target) {
        Array.prototype.forEach.call(document.querySelectorAll('link[data-spa-owner]'), (link) => {
            link.disabled = link.dataset.spaOwner !== target;
        });
    }

    function applyView(target) {
        const entry = views[target];
        if (!entry) return;

        const prevEntry = views[currentPage];
        if (prevEntry && prevEntry.el !== entry.el) {
            prevEntry.el.hidden = true;
        }

        updatePageCss(target);
        entry.el.hidden = false;
        currentPage = target;

        updateFooterActive(target);
        window.scrollTo(0, 0);
        window.dispatchEvent(new Event('resize'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
