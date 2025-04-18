export function getFilteredUrl(): string {
  const SESSION_URL_KEY = "filteredUrl";
  let url = sessionStorage.getItem(SESSION_URL_KEY);
  if (!url) {
    sessionStorage.setItem(SESSION_URL_KEY, globalThis.window.location.href);
    url = globalThis.window.location.href;
  }
  return url;
}

export function setFilteredUrl(url: string): string {
  const SESSION_URL_KEY = "filteredUrl";
  sessionStorage.setItem(SESSION_URL_KEY, url);
  return url;
}

export function updateQueryParam({
  label,
  value,
  id,
}: { label: string; value: string; id: string }): boolean {
  function setFilteredUrl(url: string): string {
    const SESSION_URL_KEY = "filteredUrl";
    sessionStorage.setItem(SESSION_URL_KEY, url);
    return url;
  }

  function getFilteredUrl(): string {
    const SESSION_URL_KEY = "filteredUrl";
    let url = sessionStorage.getItem(SESSION_URL_KEY);
    if (!url) {
      sessionStorage.setItem(SESSION_URL_KEY, globalThis.window.location.href);
      url = globalThis.window.location.href;
    }
    return url;
  }

  let isChecked;
  const url = getFilteredUrl();
  const checkbox = document.getElementById(id) as HTMLDivElement;
  const urlObject = new URL(url);
  urlObject.searchParams.delete("page");

  const searchParams = urlObject.searchParams;
  const searchParamsArray = Array.from(searchParams);

  const key = `type_tags[${label}][]`;

  const isToRemove = searchParamsArray.some((ele) =>
    JSON.stringify(ele) === JSON.stringify([key, value])
  );

  if (isToRemove) {
    const searchParamsArrayFiltered = searchParamsArray.filter((params) =>
      params[1] !== value
    );

    searchParamsArray.forEach((item) => {
      urlObject.searchParams.delete(item[0]);
    });

    searchParamsArrayFiltered.forEach((item) => {
      urlObject.searchParams.append(item[0], item[1]);
    });

    isChecked = false;
  } else {
    searchParams.append(key, value);
    isChecked = true;
  }
  setFilteredUrl(urlObject.href);
  checkbox.setAttribute("aria-checked", isChecked ? "true" : "false");
  return isChecked;
}

export const getFiltersByUrl = (url: string, windowUrl: string = "") => {
  const windowSearchParams =
    new URL(globalThis.window.location.href || windowUrl).searchParams;
  const filterSearchParams = new URL(url).searchParams;
  const windowParams = Array.from(windowSearchParams);
  const searchParams = Array.from(filterSearchParams);

  if (windowParams.length > searchParams.length) {
    const [_key, value] = windowParams.find(([key, value]) =>
      !searchParams.some(([k, v]) => k === key && v === value)
    ) as [string, string];

    return value;
  }

  const lastParam = searchParams.pop() as [string, string];
  const [_lastKey, lastValue] = lastParam;

  return lastValue;
};
