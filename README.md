# Salesforce Toolkit for Dev Code

A lightweight **Chrome extension** that supercharges Salesforce Developer Docs with useful tooling.

This project contains the **source code** for the extension that adds instant summaries, API field hover info, and copy/export utilities to the Salesforce documentation UI.

---

## ❗ Why this exists

Reading Salesforce developer docs is painful — especially when you’re hunting field types, API names, or wanting to export schema info.

This extension aims to **reduce friction**, **speed up lookup tasks**, and **help developers stay focused** instead of constantly jumping into tooling or writing quick scripts.

---

## 🛠️ What it does

- Adds **tooltips to fields/types** on Salesforce Docs.
- Allows **instant copy of API names**, metadata, and info.
- Lets you **export schema/metadata** to CSV or JSON — blown out from docs.
- Built with **minimal UI**, zero backend requirements.
- Works wherever Salesforce developer docs are served.

*(More features coming — filtering, bookmarking, API insights.)*

---

## 🚫 What it does *NOT* do

- It’s **not** a Salesforce Org inspector.
- It doesn’t connect to your orgs or expose credentials.
- It’s **not** a full IDE extension — browser only.
- It’s not yet a published NPM package or library.

---

## 🧪 How to install (dev)

1. Clone the repo  
   ```bash
   git clone git@github.com:junaideqbal/Salesforce-Toolkit-for-Dev-Code.git

2. Open Chrome ➝ Extensions
3. Enable **Developer Mode**
4. Click **Load unpacked**
5. Select this project folder

That’s it — extension is loaded.

---

## 🧩 How to use

1. Navigate to any official **Salesforce Developer Documentation page** (e.g., object/field reference, API docs).
2. You should now see hover tooltips on field names.
3. Right-click or click the export UI to dump the schema info into CSV/JSON.

(if a feature isn’t showing up, reload the page or check console errors.)

---

## 🧠 Tech / Tools

* Chrome Extension APIs (Manifest v3)
* Vanilla JavaScript
* No backend
* No license yet

---

## 🛠️ Future improvements

* Schema filtering
* Bookmark saved metadata
* UI controls for JSON schema export
* Auto-type inference
* Support for SOQL metadata views

---

## ❗ Known issues

* Runs only on docs — not workspaces like Trailhead or Salesforce setup pages.
* Some metadata pages render differently; tooltip injection may fail.
