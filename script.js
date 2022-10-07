class I18nAnalyzer {
  constructor(src, root) {
    this._src = src;
    this._root = root;

    this._idValueMap = {};
    this._objectList = [];
    this._objectTree = {};
    this._idsByValue = {};
  }

  setObject(object, keyList, value) {
    let obj = object;
    let i = 0;
    for (; i < keyList.length - 1; i++) {
      if (obj[keyList[i]] === undefined) {
        obj[keyList[i]] = {};
      }
      obj = obj[keyList[i]];
    }
    obj[keyList[i]] = value;
  }

  traverse(object, parent) {
    let name = object.name.text || object.name.escapedText;
    let id = (parent ? parent + "." : "") + name;
    let path = id.split(".");
    let initializer = object.initializer;
    let properties = object.initializer?.properties || [];
    if (initializer.constructor.name === "TokenObject") {
      let value = initializer.text;
      let normalizedValue = value
        .replaceAll(/\s+|<br>|[.,]/gi, "")
        .replaceAll(/\{\{.+\}\}/g, "{{}}");
      // indexing data.
      this._idValueMap[id] = { id, value, path };
      this._objectList.push({ id, value, path, normalizedValue });
      this.setObject(this._objectTree, path, value);
      let t = this._idsByValue[normalizedValue] ?? [];
      t.push(id);
      this._idsByValue[normalizedValue] = t;
    }
    for (let prop of properties) {
      this.traverse(prop, id);
    }
  }

  analyze() {
    /* const source = fs.readFileSync(this._path, 'utf8') */
    const tsSourceFile = ts.createSourceFile(
      "tmp",
      this._src,
      ts.ScriptTarget.Latest
    );

    console.log(tsSourceFile);
    for (let stmt of tsSourceFile.statements) {
      for (let decl of stmt.declarationList.declarations) {
        this.traverse(decl);
      }
    }
  }

  report() {
    let dupCount = 0;
    let valueCount = Object.keys(this._idsByValue).length;
    let idCount = this._objectList.length;

    let reportList = [];

    console.log("\n--- 중복된 항목");
    for (let key of Object.keys(this._idsByValue)) {
      if (this._idsByValue[key].length > 1) {
        let ids = this._idsByValue[key];
        console.log(`${key} (${ids.length})`);
        console.log(` - ${ids.join("\n - ")}`);
        reportList.push({ text: key, count: ids.length, ids: ids });
        dupCount++;
      }
    }

    document.getElementById(
      "summary"
    ).innerText = `중복됨 : ${dupCount}\n단어 수: ${valueCount}\n전체 항목 수: ${idCount}\n`;
    //fs.writeFileSync("result.json", JSON.stringify(reportList, null, 2))

    let listEl = $("ul#result");
    reportList.forEach((obj) => {
      let liEl = $("<li>").text(`${obj.text} (${obj.count})`).appendTo(listEl);
      let ulEl = $("<ul>").appendTo(liEl);
      obj.ids?.forEach((id) => {
        $("<li>").text(id).appendTo(ulEl);
      });
    });
  }
}

document.getElementById("run-btn").onclick = () => {
  console.log(1);
  let src = document.getElementById("run-target");
  let analyzer = new I18nAnalyzer(src.value, "i18nKorean");
  analyzer.analyze();
  analyzer.report();
};
