// === Entry Point ===
waitForShadowRoot(() => {
	watchForDynamicContent();
});

// === Wait for Shadow DOM to appear ===
function waitForShadowRoot(callback) {
	const interval = setInterval(() => {
		const refBody = getContentContainer();
		if (refBody) {
			clearInterval(interval);
			callback();
		}
	}, 500);
}

// === Observe dynamic doc content ===
function watchForDynamicContent() {
	const container = getContentContainer();
	if (!container) return;

	injectSummaryIfNeeded(container);

	const observer = new MutationObserver(() => {
		injectSummaryIfNeeded(container);
	});

	observer.observe(container, { childList: true, subtree: true });
}

// === Inject summary UI ===
function injectSummaryIfNeeded(container) {
	if (container.querySelector("[data-summary-injected]")) return;

	const h2s = [...container.querySelectorAll("h2.helpHead2")];
	if (!h2s.length) return;

	const summary = buildSummaryUI(h2s);
	container.insertBefore(summary, container.firstChild);
}

// === Build the complete summary UI ===
function buildSummaryUI(h2s) {
	const wrapper = document.createElement("div");
	wrapper.setAttribute("data-summary-injected", "true");
	wrapper.style = summaryWrapperStyle();

	const title = document.createElement("h3");
	title.textContent = "🧾 Summary of All Sections";
	title.style = summaryTitleStyle();
	wrapper.appendChild(title);

	h2s.forEach((h2) => {
		const group = createFieldGroup(h2);
		if (group) wrapper.appendChild(group);
	});

	return wrapper;
}

// === Create field group for one table ===
function createFieldGroup(h2) {
	const sectionTitle = h2.textContent.trim();
	const tables = [];

    // ✅ Look inside the current section (in case table is right below <h2>)
    const currentSectionTables = h2.parentElement.querySelectorAll("table.featureTable");
    if (currentSectionTables?.length) tables.push(...currentSectionTables);

    // 🔁 Then continue with next siblings until next <h2>
    let next = h2.parentElement.nextElementSibling;
    while (next) {
        if (next.querySelector?.("h2.helpHead2")) break; // stop at next section

        const foundTables = next.querySelectorAll?.("table.featureTable");
        if (foundTables?.length) tables.push(...foundTables);

        next = next.nextElementSibling;
    }
    const fieldMap = new Map();

	if (!tables.length) return null;
    tables.forEach(table => {
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach((row) => {
            const fieldTd = row.querySelector(
                'td[data-title="Field"], td[data-title="Field Name"]'
            );
            const descTd = row.querySelector(
                'td[data-title="Description"], td[data-title="Details"]'
            );
            const typeTd = row.querySelector(
                'td[data-title="Type"], td[data-title="Field Type"]'
            );

            const fieldName = fieldTd?.textContent.trim();
            if (!fieldName) return;

            let description = descTd ? descTd.textContent : "";
            let type = typeTd ? typeTd.textContent.trim() : "";

            description = cleanText(description);

            let tooltip = "";
            if (type) tooltip += `Type:\n${type}\n\n`;
            if (description) tooltip += `Description:\n${description}`;
            tooltip = tooltip.trim() || "No additional info available.";

            fieldMap.set(fieldName, tooltip);
        });
    });

	if (!fieldMap.size) return null;

	// === Create group UI ===
	const group = document.createElement("div");
	group.style = groupWrapperStyle();

	const header = document.createElement("div");
	header.style = groupHeaderStyle();

	const title = document.createElement("div");
	title.textContent = `🔹 ${sectionTitle} — ${fieldMap.size} field(s)`;
	title.style.fontWeight = "bold";
	title.style.marginBottom = "4px";
	title.style.color = "#222";

	// --- Field format selector ---
	const formatLabel = document.createElement("label");
	formatLabel.textContent = "Copy fields as:";
	formatLabel.style.fontSize = "12px";
	formatLabel.style.marginRight = "6px";

	const formatSelect = document.createElement("select");
	formatSelect.style.fontSize = "12px";
	formatSelect.style.padding = "2px 4px";

	["None", "Single Quotes", "Double Quotes"].forEach((option) => {
		const opt = document.createElement("option");
		opt.value = option;
		opt.textContent = option;
		formatSelect.appendChild(opt);
	});

	const formatWrapper = document.createElement("div");
	formatWrapper.style.display = "flex";
	formatWrapper.style.alignItems = "center";
	formatWrapper.appendChild(formatLabel);
	formatWrapper.appendChild(formatSelect);

	const copyBtn = document.createElement("button");
	copyBtn.textContent = "📋 Copy Fields";
	copyBtn.style = copyBtnStyle();
	copyBtn.onclick = () => {
		const text = [...fieldMap.keys()]
			.map((name) => formatFieldName(name, formatSelect.value))
			.join(", ");
		navigator.clipboard
			.writeText(text)
			.then(() => showToast("✅ Fields copied!"));
	};

	header.appendChild(title);
	header.appendChild(formatWrapper);
	header.appendChild(copyBtn);
	group.appendChild(header);

	const fieldList = document.createElement("div");
	fieldList.style.display = "flex";
	fieldList.style.flexWrap = "wrap";
	fieldList.style.gap = "6px";

	fieldMap.forEach((tooltip, field) => {
		const tag = document.createElement("span");
		tag.textContent = field;
		tag.title = tooltip;
		tag.style = fieldTagStyle();
		tag.onclick = () => {
			const formatted = formatFieldName(field, formatSelect?.value);
			navigator.clipboard.writeText(formatted).then(() => {
				showToast(`✅ ${formatted} copied!`);
			});
		};

		fieldList.appendChild(tag);
	});

	group.appendChild(fieldList);
	return group;
}

// === Toast popup ===
function showToast(msg) {
	const toast = document.createElement("div");
	toast.textContent = msg;
	toast.style = toastStyle();
	document.body.appendChild(toast);
	setTimeout(() => (toast.style.opacity = "1"), 10);
	setTimeout(() => {
		toast.style.opacity = "0";
		setTimeout(() => toast.remove(), 300);
	}, 1500);
}

// === Style functions ===
function summaryWrapperStyle() {
	return "border:2px solid #999;padding:10px;margin-bottom:20px;background:#f0f0f0;font-family:sans-serif;font-size:13px;";
}
function summaryTitleStyle() {
	return "margin-top:0;font-size:16px;border-bottom:1px solid #ccc;padding-bottom:4px;";
}
function groupWrapperStyle() {
	return "margin-bottom:12px;padding:6px;border:1px solid #ccc;background:#fff;";
}
function groupHeaderStyle() {
	return "display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;";
}
function copyBtnStyle() {
	return "font-size:12px;padding:2px 6px;border:1px solid #aaa;border-radius:4px;cursor:pointer;background:#fff;";
}
function fieldTagStyle() {
	return "padding:3px 6px;border:1px solid #aaa;border-radius:4px;background:#eef;font-size:12px;white-space:nowrap;cursor:help;";
}
function toastStyle() {
	return "position:fixed;bottom:20px;right:20px;background:#333;color:#fff;padding:8px 12px;border-radius:4px;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,0.3);z-index:9999;opacity:0;transition:opacity 0.3s;";
}

// === Get container div inside shadow root ===
function getContentContainer() {
	const docXml = document.querySelector("#maincontent > doc-xml-content");
	const docContent = docXml?.shadowRoot?.querySelector(
		"doc-content-layout > doc-content"
	);
	return docContent?.shadowRoot?.querySelector(
		'div.container[data-name="content"]'
	);
}

// === Text cleaner ===
function cleanText(text) {
	return text
		.replace(/\r/g, "")
		.replace(/[ \t]+\n/g, "\n")
		.replace(/\n[ \t]+/g, "\n")
		.replace(/[ \t]{2,}/g, " ")
		.replace(/\n{3,}/g, "\n\n")
		.replace(/[ ]{2,}/g, " ")
		.trim();
}

function formatFieldName(name, style) {
	switch (style) {
		case "Single Quotes":
			return `'${name}'`;
		case "Double Quotes":
			return `"${name}"`;
		default:
			return name;
	}
}
