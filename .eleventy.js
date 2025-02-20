const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const Image = require("@11ty/eleventy-img");

const path = require('path');
const fs = require('fs');

function imageShortcode(src, alt, sizes="(min-width: 1024px) 100vw, 50vw") {

    console.log(`Generating image(s) from:  ${src}`)

    let imageSrc = `${path.dirname(this.page.inputPath)}/${src}`

    let options = {
        widths: [800, 1600],
        formats: ["webp", "jpeg"],
        outputDir: path.dirname(this.page.outputPath),
        urlPath: this.page.url,
        filenameFormat: function (id, src, width, format, options) {
            const extension = path.extname(src)
            const name = path.basename(imageSrc, extension)
            return `${name}-${width}w.${format}`
        }
    }

    Image(imageSrc, options)

    let imageAttributes = {
        alt,
        sizes,
        loading: "lazy",
        decoding: "async",
    }

    metadata = Image.statsSync(imageSrc, options)
    return Image.generateHTML(metadata, imageAttributes)

}


module.exports = (config) => {

    let options = {
		html: true,
		breaks: true,
		linkify: true,
	};

    const markdownLib = markdownIt(options)

    config.setLibrary("md", markdownLib),

    config.addFilter("showDecade", (date) => {
        return date.getFullYear();
    });

    config.addPassthroughCopy("./src/assets/css/");
    config.addPassthroughCopy("./src/assets/fonts/");

    config.addFilter("debugger", (...args) => {
        console.log(...args)
        debugger;
    });

    config.addShortcode("image", imageShortcode);

    config.addLayoutAlias('index', 'layout/index.html');
    config.addLayoutAlias('page', 'layout/page.html');

    config.addCollection("type", function(collectionApi) {
        return collectionApi.getAll().filter(function(item) {
          return "type" in item.data
        })
    })
    
    return {
        showAllHosts: true,
        passthroughFileCopy: true,
        markdownTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dir: {
            input: "src",
            output: "dist",
            includes: "_includes"
        }
    }

}