const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Inline CSS filter — reads the file and returns its contents
  eleventyConfig.addFilter("inlineCss", function (filePath) {
    var fullPath = path.resolve(__dirname, filePath);
    return fs.readFileSync(fullPath, "utf8");
  });

  // Pass through static assets (paths relative to project root, not input dir)
  // Keep CSS passthrough for cache — browsers that already have it won't re-download
  eleventyConfig.addPassthroughCopy({ "css": "css" });
  eleventyConfig.addPassthroughCopy({ "js": "js" });
  eleventyConfig.addPassthroughCopy({ "images": "images" });
  eleventyConfig.addPassthroughCopy({ "favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "favicon-16x16.png": "favicon-16x16.png" });
  eleventyConfig.addPassthroughCopy({ "favicon-32x32.png": "favicon-32x32.png" });
  eleventyConfig.addPassthroughCopy({ "apple-touch-icon.png": "apple-touch-icon.png" });

  // Gallery JSON needs to be available as a static file for client-side fetch
  eleventyConfig.addPassthroughCopy({ "content/gallery.json": "gallery.json" });

  // SEO files
  eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "CNAME": "CNAME" });

  // Watch CSS and JS for live reload
  eleventyConfig.addWatchTarget("css/");
  eleventyConfig.addWatchTarget("js/");

  return {
    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data",
      output: "_site",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
