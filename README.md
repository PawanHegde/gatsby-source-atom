# gatsby-source-atom

Plugin for pulling data into Gatsby.js from an Atom feed (using [FeedParser](https://github.com/danmactough/node-feedparser "node-feedparser")).

## Install

`npm install --save gatsby-source-atom`

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    // You can have multiple instances of this plugin
    // to read source nodes from different URLs.

    {
      resolve: `gatsby-source-atom`,
      options: {
        source: `https://<example-site>/atom`,
        exposeBasalElements: true
      }
    },
    {
      resolve: `gatsby-source-atom`,
      options: {
        source: `http://<example-site>/blog/atom`,
        additionalEntryFields: ["custom_tag"]
      }
    }
  ]
};
```

## Under the hood

The plugin uses FeedParser internally and by default only exposes processed elements supported by FeedParser because sometimes the basal elements give trouble when creating gatsby nodes. The following fields are available by default

### Feed Fields

- `title`,
- `description`,
- `link`,
- `xmlurl`,
- `date`,
- `pubdate`,
- `author`,
- `language`,
- `image`,
- `favicon`,
- `copyright`,
- `generator`,
- `categories`

### Entry Fields

- `title`,
- `description`,
- `link`,
- `origlink`,
- `permalink`,
- `date`,
- `pubdate`,
- `author`,
- `guid`,
- `comments`,
- `image`,
- `categories`,
- `source`,
- `enclosures`

## Options

- **source** `string`: A valid URL to the Atom feed

* **exposeBasalElements** `boolean` (optional: `false` by default): Set this to `true` to query atom elements such as `atom_id` directly in GraphQL. You might see warnings during your gatsby build. This is usually because the values for a field name are inconsistent between entries. In that case, that particular field will not appear in GraphQL, but nothing else will be affected. It is safe to use except for the warnings.

* **additionalEntryFields** `array of strings` (optional: `[]` by default): If there are specific elements in your feed entries that are not part of the processed entry fields mentioned above, you can add them here. If `exposeBasalElements` is enabled, this option will have no effect.

* **additionalMetaFields** `array of strings` (optional: `[]` by default): If there are specific elements in your feed's metadata that are not part of the processed meta fields mentioned above, you can add them here. If `exposeBasalElements` is enabled, this option will have no effect.

Note: If you don't mind the warnings, `exposeBasalElements` is the easiest way to get most of the elements in the feed directly. But if you want to get rid of the warnings, you could enable `exposeBasalElements` temporarily to identify fields that you need to add to `additionalEntryFields` or `additionalMetaFields` and then turn it off. This will prevent gatsby from trying to create unnecessary nodes.

## How to query

You can query all entries from all your sources together as follows:

```graphql
{
  allAtomEntry {
    edges {
      node {
        title
        link
      }
    }
  }
}
```

You can also access them separately based on source url and query meta information as follows:

```graphql
{
  allAtomFeed {
    edges {
      node {
        author
        description
        childrenAtomEntry {
          title
          link
        }
      }
    }
  }
}
```
