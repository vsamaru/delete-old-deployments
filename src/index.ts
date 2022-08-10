const DAYS = 7;
const LIMIT = 40;
const HEADERS = {
	"content-type": "application/json;charset=UTF-8",
	// @ts-ignore
	"X-Auth-Email": ACCOUNT_EMAIL,
	// @ts-ignore
	"X-Auth-Key": API_KEY,
};

const getProjects = async () => {
	// @ts-ignore
	const URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects`;

	const projects: {
		result: any;
	} = await (
		await fetch(URL, {
			headers: HEADERS,
		})
	).json();

	return projects.result;
};

const getDeployments = async (project: string) => {
	// @ts-ignore
	const URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${project}/deployments`;

	const deployments: {
		result: [];
	} = await (
		await fetch(URL, {
			headers: HEADERS,
		})
	).json();

	return deployments.result;
};

const deleteOldDeployments = async () => {
	const projects = await getProjects();

	for (const project of projects) {
		// @ts-ignore
		const URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${project}/deployments`;

		const deployments: {
			id: string;
		}[] = await getDeployments(project.name);

		for (const deployment of deployments.splice(0, LIMIT)) {
			if (
				// @ts-ignore
				(Date.now() - new Date(deployment.created_on)) / 86400000 >
				DAYS
			) {
				await fetch(`${URL}/${deployment.id}`, {
					method: "DELETE",
					headers: HEADERS,
				});
			}
		}
	}

	return new Response("OK", { status: 200 });
};

addEventListener(
	"fetch",
	(event: { respondWith: (arg0: Promise<Response>) => void }) => {
		event.respondWith(deleteOldDeployments());
	}
);

addEventListener(
	"scheduled",
	(event: { waitUntil: (arg0: Promise<Response>) => void }) => {
		event.waitUntil(deleteOldDeployments());
	}
);
