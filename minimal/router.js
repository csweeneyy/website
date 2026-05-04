
// Initialize Swup
if (!window.swup) {
  window.swup = new Swup({
    containers: ['#swup'],
    plugins: [new SwupScriptsPlugin({
      head: true,
      body: true
    })]
  });
}
