export const isNotDefined = <T>(value: T | undefined | null): value is undefined | null =>
  value === undefined || value === null;

export const isDefined = <T>(value: T | undefined | null): value is NonNullable<T> =>
  value !== undefined && value !== null;

export const isEmpty = (value: string | undefined | null): value is undefined =>
  value === undefined || value === null || value === "";

export const isNotEmpty = (value: string | undefined | null): value is string =>
  value !== undefined && value !== null && value !== "";

export const sendRequest = async <ResponseData>(
  params:
    | {
        url: string;
        method: string;
        body?: Record<string, unknown> | FormData;
        tenantId?: string;
      }
    | string
): Promise<{ data?: ResponseData; error?: Error }> => {
  try {
    const url = typeof params === "string" ? params : params.url;
    const response = await fetch(url, {
      method: typeof params === "string" ? "GET" : params.method,
      // mode: 'cors',
      headers:
        typeof params !== "string" && isDefined(params.body)
          ? {
              "Content-Type": "application/json",
              "x-tenant-code": typeof params !== "string" ? params?.tenantId ?? "" : "",
            }
          : {
              "x-tenant-code": typeof params !== "string" ? params?.tenantId ?? "" : "",
            },
      body: typeof params !== "string" && isDefined(params.body) ? JSON.stringify(params.body) : undefined,
    });
    const data = await response.json();
    if (!response.ok) throw "error" in data ? data.error : data;
    return { data };
  } catch (e) {
    console.error(e);
    return { error: e as Error };
  }
};

export const sendMultipartRequest = async <ResponseData>(params: {
  url: string;
  method: string;
  body?: FormData;
  tenantId?: string;
}): Promise<{ data?: ResponseData; error?: Error }> => {
  try {
    const url = params.url;
    const response = await fetch(url, {
      method: params.method,
      // mode: 'cors',
      headers: {
        // "Content-Type": "multipart/form-data",
        "x-tenant-code": typeof params !== "string" ? params?.tenantId ?? "" : "",
      },
      body: params.body ?? undefined,
    });
    const data = await response.json();
    if (!response.ok) throw "error" in data ? data.error : data;
    return { data };
  } catch (e) {
    console.error(e);
    return { error: e as Error };
  }
};
