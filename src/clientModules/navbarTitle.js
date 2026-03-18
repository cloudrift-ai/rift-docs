import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  const observer = new MutationObserver(() => {
    const titleEl = document.querySelector('.navbar__title');
    if (titleEl && !titleEl.querySelector('.accent')) {
      titleEl.innerHTML = titleEl.textContent.replace(
        'R',
        '<span class="accent">R</span>',
      );
    }
  });

  observer.observe(document.documentElement, {childList: true, subtree: true});
}
