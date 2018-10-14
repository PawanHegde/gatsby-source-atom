const _ = require("lodash");
const crypto = require("crypto");
const fetch = require("node-fetch");
const FeedParser = require("feedparser");

exports.sourceNodes = ({ actions, createNodeId }, configOptions) => {
  const { createNode } = actions;

  delete configOptions.plugins;
  const source = configOptions.source;

  let meta = {};
  let entries = [];

  function addMeta() {
    Object.assign(meta, this.meta);
  }

  function addEntry() {
    const stream = this;
    while ((item = stream.read())) {
      entries.push(item);
    }
  }

  function processAtomFeed() {
    const entryIds = entries.map(entry => createNodeId(entry.link));
    createAtomNode(`AtomFeed`, meta.link, null, entryIds, meta);

    entries.map(entry => {
      createAtomNode(`AtomEntry`, entry.link, meta.link, [], entry);
    });
  }

  function createAtomNode(type, id, parent, kids, data) {
    const nodeId = createNodeId(id);
    const nodeContent = JSON.stringify(data);
    const nodeContentDigest = crypto
      .createHash("md5")
      .update(nodeContent)
      .digest("hex");

    const nodeData = Object.assign(data, {
      id: nodeId,
      parent: parent,
      children: kids,
      internal: {
        type: type,
        content: nodeContent,
        contentDigest: nodeContentDigest
      }
    });

    createNode(nodeData);
  }

  return fetch(source)
    .then(response => response.body)
    .then(atom => {
      return new Promise((resolve, reject) => {
        const feedparser = new FeedParser();

        feedparser.on("meta", addMeta);
        feedparser.on("readable", addEntry);
        feedparser.on("end", () => {
          processAtomFeed();
          resolve();
        });

        atom.pipe(feedparser);
      });
    });
};
