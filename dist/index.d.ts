/// <reference types="@cloudflare/workers-types" />
declare const DAYS = 7;
declare const LIMIT = 40;
declare const HEADERS: {
    "content-type": string;
    "X-Auth-Email": any;
    "X-Auth-Key": any;
};
declare const getProjects: () => Promise<any>;
declare const getDeployments: (project: string) => Promise<[]>;
declare const deleteOldDeployments: () => Promise<Response>;
