function targetIsLocalhost(instanceName: string) {
	return instanceName.startsWith('localhost:') || instanceName.startsWith('127.0.0.1:');
}

export function basename(instanceName: string) {
	if (targetIsLocalhost(instanceName)) {
		return `http://${instanceName}`;
	}
	return `https://${instanceName}`;
}

export function auth(accessToken: string) {
	return {
		Authorization: `Bearer ${accessToken}`
	};
}
