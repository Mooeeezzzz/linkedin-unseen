function cancelBlock(details) {
  if (
    details.url.match(
      /^https?:\/\/w*.linkedin.com\/voyager\/api\/messaging\/conversations\/*\//
    )
  ) {
    const postedString = decodeURIComponent(
      String.fromCharCode.apply(
        null,
        new Uint8Array(details.requestBody?.raw[0].bytes)
      )
    );
    if (!(postedString && JSON.parse(postedString)?.patch?.$set?.read)) {
      return false;
    }
  }

  return true;
}

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    return { cancel: cancelBlock(details) };
  },
  {
    urls: [
      "*://*.linkedin.com/voyager/api/messaging/conversations?action=*",
      "*://*.linkedin.com/voyager/api/messaging/conversations/*",
      "*://*.linkedin.com/li/track*",
      "*://*.linkedin.com/voyager/api/messaging/badge?action=markAllItemsAsSeen"
    ]
  },
  ["requestBody", "blocking"]
);
