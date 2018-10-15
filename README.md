# gatsby-source-atom

Plugin for pulling data into Gatsby.js from an Atom feed

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
      },
    },
    {
      resolve: `gatsby-source-atom`,
      options: {
        source: `http://<example-site>/blog/atom`,
      },
    },
  ],
}
```

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

You can also access them separately based on source url 
and query meta information as follows:

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
