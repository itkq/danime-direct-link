export {}

const main = async (): Promise<void> => {
  const getTargetElement = (): Element => {
    const e = document.querySelector('div#streamingQuality');
    if (!e) {
      throw new Error('target element not found');
    }

    return e;
  }

  const sleep = async (ms: number) => { 
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(null);
      }, ms)
    })
  }

  const callWithRetry = async (fn: () => Element, depth = 0): Promise<Element> => {
    try {
      return fn();
    } catch (e: any) {
      if (depth > 7) {
        throw new e;
      }
      await sleep(2 ** depth * 200);
      return callWithRetry(fn, depth + 1);
    }
  }

  const DanimeOpenNewTabId = 'danime-open-new-tab';

  const addLink = (targetElement: Element, currentUrl: string) => {
    if (targetElement.parentNode && Array.from(targetElement.parentNode.children).some(c => c.id === DanimeOpenNewTabId)) {
      return;
    }

    // e.g. https://animestore.docomo.ne.jp/animestore/ci_pc?workId=25806&partId=25806012 to https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=25806012
    const m = currentUrl.match(/^https:\/\/animestore.docomo.ne.jp\/animestore\/ci_pc\?workId=\d+&partId=(\d+)$/);

    if (!m || m.length < 1) {
      throw new Error('failed to match');
    }
    const href = `https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=${m[1]}`;

    const openNewTabLink = document.createElement('a');
    openNewTabLink.id = DanimeOpenNewTabId;
    const linkText = document.createTextNode('Direct link');
    openNewTabLink.appendChild(linkText);
    openNewTabLink.title = 'Direct link';
    openNewTabLink.href = href;
    openNewTabLink.target = '_blank';
    targetElement.insertAdjacentElement('afterend', openNewTabLink);
  }

  try {
    const target = await callWithRetry(getTargetElement);
    const currentUrl = document.location.href;
    addLink(target, currentUrl);
  } catch (e) {
    console.error(e);
  }
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url && tab.url.match(/^https:\/\/animestore.docomo.ne.jp\/animestore\/ci_pc\?workId=\d+&partId=(\d+)$/)) {
    chrome.scripting.executeScript({
      target: { tabId: tabId, allFrames: true },
      func: main,
    });
  }
});
